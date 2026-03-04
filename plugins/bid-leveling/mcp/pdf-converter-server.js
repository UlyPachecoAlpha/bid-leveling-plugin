#!/usr/bin/env node
/**
 * PDF Converter MCP Server for Bid Leveling Plugin
 * 
 * Converts PDFs to Excel/Word for better data extraction before bid analysis.
 * Supports two backends:
 *   1. PDF.co API (high quality, requires API key)
 *   2. Local conversion via pdf-parse + xlsx (free, lower quality)
 * 
 * Tools exposed:
 *   - convert_pdf_to_excel: Convert PDF bid document to XLSX
 *   - convert_pdf_to_word:  Convert PDF bid document to DOCX  
 *   - list_conversions:     Show recent conversion history
 */

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// Track conversions for list_conversions tool
const conversionHistory = [];

// ── PDF.co API conversion ──
async function convertViaPdfCo(inputPath, outputFormat) {
  const apiKey = process.env.PDFCO_API_KEY;
  if (!apiKey) throw new Error("PDFCO_API_KEY not set. Set it as an environment variable or use local conversion.");

  const fileBuffer = fs.readFileSync(inputPath);
  const base64 = fileBuffer.toString("base64");
  const fileName = path.basename(inputPath);

  // Step 1: Upload file
  const uploadResult = await httpPost("https://api.pdf.co/v1/file/upload/base64", {
    name: fileName,
    file: base64,
  }, { "x-api-key": apiKey, "Content-Type": "application/json" });

  if (uploadResult.error) throw new Error(`PDF.co upload error: ${uploadResult.message}`);
  const fileUrl = uploadResult.url;

  // Step 2: Convert
  let endpoint;
  if (outputFormat === "xlsx") endpoint = "https://api.pdf.co/v1/pdf/convert/to/xlsx";
  else if (outputFormat === "docx") endpoint = "https://api.pdf.co/v1/pdf/convert/to/doc";
  else throw new Error(`Unsupported format: ${outputFormat}`);

  const convertResult = await httpPost(endpoint, {
    url: fileUrl,
    name: fileName.replace(".pdf", `.${outputFormat}`),
    inline: false,
  }, { "x-api-key": apiKey, "Content-Type": "application/json" });

  if (convertResult.error) throw new Error(`PDF.co conversion error: ${convertResult.message}`);

  // Step 3: Download result
  const outputPath = inputPath.replace(/\.pdf$/i, `.${outputFormat}`);
  await downloadFile(convertResult.url, outputPath);
  return outputPath;
}

// ── Local fallback conversion (PDF -> XLSX via pdf-parse + xlsx) ──
async function convertLocalToExcel(inputPath) {
  let pdfParse, XLSX;
  try { pdfParse = require("pdf-parse"); } catch { throw new Error("pdf-parse not installed. Run: npm install pdf-parse"); }
  try { XLSX = require("xlsx"); } catch { throw new Error("xlsx not installed. Run: npm install xlsx"); }

  const buffer = fs.readFileSync(inputPath);
  const data = await pdfParse(buffer);
  const lines = data.text.split("\n").filter(l => l.trim());
  
  // Try to detect tabular data
  const rows = lines.map(line => {
    // Split on multiple spaces or tabs (common in PDF tables)
    return line.split(/\s{2,}|\t/).map(c => c.trim()).filter(c => c);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Extracted");

  const outputPath = inputPath.replace(/\.pdf$/i, ".xlsx");
  XLSX.writeFile(wb, outputPath);
  return outputPath;
}

// ── HTTP helpers ──
function httpPost(url, body, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = JSON.stringify(body);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: { ...headers, "Content-Length": Buffer.byteLength(data) },
    };
    const req = https.request(options, (res) => {
      let chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch { resolve({ error: true, message: "Invalid JSON response" }); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, outputPath).then(resolve).catch(reject);
      }
      const stream = fs.createWriteStream(outputPath);
      res.pipe(stream);
      stream.on("finish", () => { stream.close(); resolve(outputPath); });
    }).on("error", reject);
  });
}

// ── MCP Server Setup ──
const server = new Server({ name: "bid-leveling-pdf-converter", version: "1.0.0" }, {
  capabilities: { tools: {} },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "convert_pdf_to_excel",
      description: "Convert a PDF bid document to Excel (.xlsx) for cleaner data extraction. Uses PDF.co API if PDFCO_API_KEY is set, otherwise falls back to local conversion. Returns the output file path.",
      inputSchema: {
        type: "object",
        properties: {
          input_path: { type: "string", description: "Absolute path to the PDF file to convert" },
          use_local: { type: "boolean", description: "Force local conversion (no API key needed, lower quality). Default: false", default: false },
        },
        required: ["input_path"],
      },
    },
    {
      name: "convert_pdf_to_word",
      description: "Convert a PDF bid document to Word (.docx) for cleaner text extraction. Requires PDF.co API key (PDFCO_API_KEY env var). Returns the output file path.",
      inputSchema: {
        type: "object",
        properties: {
          input_path: { type: "string", description: "Absolute path to the PDF file to convert" },
        },
        required: ["input_path"],
      },
    },
    {
      name: "list_conversions",
      description: "List all PDF conversions performed in this session with their status and output paths.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const startTime = Date.now();

  try {
    if (name === "convert_pdf_to_excel") {
      const inputPath = args.input_path;
      if (!fs.existsSync(inputPath)) throw new Error(`File not found: ${inputPath}`);
      if (!inputPath.toLowerCase().endsWith(".pdf")) throw new Error("Input must be a .pdf file");

      let outputPath;
      let method;
      if (args.use_local || !process.env.PDFCO_API_KEY) {
        outputPath = await convertLocalToExcel(inputPath);
        method = "local (pdf-parse + xlsx)";
      } else {
        outputPath = await convertViaPdfCo(inputPath, "xlsx");
        method = "PDF.co API";
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      conversionHistory.push({ input: inputPath, output: outputPath, format: "xlsx", method, time: `${elapsed}s`, status: "success" });

      return { content: [{ type: "text", text: `Converted to Excel in ${elapsed}s using ${method}.\nOutput: ${outputPath}` }] };
    }

    if (name === "convert_pdf_to_word") {
      const inputPath = args.input_path;
      if (!fs.existsSync(inputPath)) throw new Error(`File not found: ${inputPath}`);
      if (!inputPath.toLowerCase().endsWith(".pdf")) throw new Error("Input must be a .pdf file");
      if (!process.env.PDFCO_API_KEY) throw new Error("PDF-to-Word conversion requires PDFCO_API_KEY. Set it as an environment variable. Get a free key at https://pdf.co");

      const outputPath = await convertViaPdfCo(inputPath, "docx");
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      conversionHistory.push({ input: inputPath, output: outputPath, format: "docx", method: "PDF.co API", time: `${elapsed}s`, status: "success" });

      return { content: [{ type: "text", text: `Converted to Word in ${elapsed}s using PDF.co API.\nOutput: ${outputPath}` }] };
    }

    if (name === "list_conversions") {
      if (conversionHistory.length === 0) return { content: [{ type: "text", text: "No conversions performed yet." }] };
      const summary = conversionHistory.map((c, i) =>
        `${i + 1}. ${path.basename(c.input)} -> ${c.format.toUpperCase()} (${c.method}, ${c.time}, ${c.status})\n   Output: ${c.output}`
      ).join("\n");
      return { content: [{ type: "text", text: summary }] };
    }

    return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    conversionHistory.push({ input: args?.input_path || "unknown", output: null, format: name.includes("excel") ? "xlsx" : "docx", method: "failed", time: `${elapsed}s`, status: `error: ${error.message}` });
    return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
