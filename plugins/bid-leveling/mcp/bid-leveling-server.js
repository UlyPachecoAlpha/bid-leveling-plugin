#!/usr/bin/env node
/**
 * Bid Leveling MCP Server (Zero Dependencies)
 * 
 * Pure Node.js MCP server — no npm install required.
 * Communicates via stdio using the MCP JSON-RPC protocol directly.
 * 
 * Tools:
 *   - convert_pdf_to_excel:   Convert PDF to XLSX (local, no API needed)
 *   - convert_pdf_to_word:    Convert PDF to DOCX (requires PDF.co API key)
 *   - trigger_power_automate: Trigger a Power Automate flow via webhook
 *   - list_conversions:       Show conversion history
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { execSync } = require("child_process");

const conversionHistory = [];

// ── Tool Definitions ──
const TOOLS = [
  {
    name: "convert_pdf_to_excel",
    description: "Convert a PDF bid document to Excel (.xlsx) for cleaner data extraction before bid analysis. Works without any API key using local Node.js conversion.",
    inputSchema: {
      type: "object",
      properties: {
        input_path: { type: "string", description: "Absolute path to the PDF file to convert" },
      },
      required: ["input_path"],
    },
  },
  {
    name: "convert_pdf_to_word",
    description: "Convert a PDF bid document to Word (.docx). Requires PDF.co API key (PDFCO_API_KEY env var). Get a free key at https://pdf.co",
    inputSchema: {
      type: "object",
      properties: {
        input_path: { type: "string", description: "Absolute path to the PDF file to convert" },
      },
      required: ["input_path"],
    },
  },
  {
    name: "trigger_power_automate",
    description: "Trigger a Power Automate workflow via webhook. Use this to send emails, convert PDFs via Adobe Acrobat, send notifications, process files, or run any custom Power Automate flow. When the user says 'send via Power Automate' or 'email via Power Automate' or 'trigger the flow', use this tool.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", description: "The action for the flow (e.g. 'send_email', 'convert_pdf', 'notify_team'). Default: 'bid_leveling_task'" },
        title: { type: "string", description: "Subject line or title for this workflow run" },
        priority: { type: "string", enum: ["low", "normal", "high", "urgent"], description: "Priority level. Default: 'normal'" },
        email_body: { type: "string", description: "Email body content (HTML or plain text). Used when action is 'send_email'." },
        recipients: { type: "string", description: "Comma-separated email addresses for email actions." },
        webhook_url: { type: "string", description: "Optional: Override the default webhook URL" },
      },
    },
  },
  {
    name: "list_conversions",
    description: "List all PDF conversions performed in this session.",
    inputSchema: { type: "object", properties: {} },
  },
];

// ── Tool Handlers ──
async function handleTool(name, args) {
  const start = Date.now();

  if (name === "convert_pdf_to_excel") {
    const inputPath = args.input_path;
    if (!inputPath) throw new Error("input_path is required");
    if (!fs.existsSync(inputPath)) throw new Error("File not found: " + inputPath);
    if (!inputPath.toLowerCase().endsWith(".pdf")) throw new Error("Input must be a .pdf file");

    // Ensure xlsx is available
    ensureNpmPackage("xlsx");
    ensureNpmPackage("pdf-parse");

    const pdfParse = require("pdf-parse");
    const XLSX = require("xlsx");

    const buffer = fs.readFileSync(inputPath);
    const data = await pdfParse(buffer);
    const lines = data.text.split("\n").filter(l => l.trim());
    const rows = lines.map(line => line.split(/\s{2,}|\t/).map(c => c.trim()).filter(c => c));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Extracted");

    const outputPath = inputPath.replace(/\.pdf$/i, ".xlsx");
    XLSX.writeFile(wb, outputPath);

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    conversionHistory.push({ input: inputPath, output: outputPath, format: "xlsx", method: "local", time: elapsed + "s", status: "success" });
    return "Converted to Excel in " + elapsed + "s.\nOutput: " + outputPath;
  }

  if (name === "convert_pdf_to_word") {
    const inputPath = args.input_path;
    if (!inputPath) throw new Error("input_path is required");
    if (!fs.existsSync(inputPath)) throw new Error("File not found: " + inputPath);
    const apiKey = process.env.PDFCO_API_KEY;
    if (!apiKey) throw new Error("PDF-to-Word requires PDFCO_API_KEY. Get a free key at https://pdf.co");

    const outputPath = await convertViaPdfCo(inputPath, "docx", apiKey);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    conversionHistory.push({ input: inputPath, output: outputPath, format: "docx", method: "PDF.co", time: elapsed + "s", status: "success" });
    return "Converted to Word in " + elapsed + "s.\nOutput: " + outputPath;
  }

  if (name === "trigger_power_automate") {
    const defaultUrl = "https://ce34d4adca74eb6483db3ed4881cc5.15.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4ded1c4f582e4604885ddb3e50481eb4/triggers/manual/paths/invoke?api-version=1";
    const webhookUrl = args.webhook_url || process.env.POWER_AUTOMATE_WEBHOOK_URL || defaultUrl;

    const payload = {
      action: args.action || "bid_leveling_task",
      title: args.title || "Bid Leveling Plugin Request",
      priority: args.priority || "normal",
      timestamp: new Date().toISOString(),
      source: "bid-leveling-plugin",
    };
    if (args.email_body) payload.email_body = args.email_body;
    if (args.recipients) payload.recipients = args.recipients;

    const result = await httpPost(webhookUrl, payload, { "Content-Type": "application/json" });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const responseText = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
    return "Power Automate flow triggered in " + elapsed + "s.\nAction: " + payload.action + "\nTitle: " + payload.title + "\nPriority: " + payload.priority + (args.recipients ? "\nRecipients: " + args.recipients : "") + "\nResponse:\n" + responseText;
  }

  if (name === "list_conversions") {
    if (conversionHistory.length === 0) return "No conversions performed yet.";
    return conversionHistory.map((c, i) =>
      (i + 1) + ". " + path.basename(c.input) + " -> " + c.format.toUpperCase() + " (" + c.method + ", " + c.time + ", " + c.status + ")\n   Output: " + c.output
    ).join("\n");
  }

  throw new Error("Unknown tool: " + name);
}

// ── Helpers ──
function ensureNpmPackage(pkg) {
  try {
    require.resolve(pkg);
  } catch {
    // Install to the same directory as this script
    const dir = __dirname;
    log("Installing " + pkg + " in " + dir);
    execSync("npm install --prefix " + JSON.stringify(dir) + " " + pkg, {
      stdio: "ignore",
      timeout: 60000,
    });
    // Clear require cache so it picks up the new install
    const modPath = path.join(dir, "node_modules", pkg);
    if (fs.existsSync(modPath)) {
      module.paths.unshift(path.join(dir, "node_modules"));
    }
  }
}

async function convertViaPdfCo(inputPath, format, apiKey) {
  const fileBuffer = fs.readFileSync(inputPath);
  const base64 = fileBuffer.toString("base64");
  const fileName = path.basename(inputPath);

  const uploadResult = await httpPost("https://api.pdf.co/v1/file/upload/base64", {
    name: fileName, file: base64,
  }, { "x-api-key": apiKey, "Content-Type": "application/json" });
  if (uploadResult.error) throw new Error("PDF.co upload error: " + uploadResult.message);

  const endpoint = format === "xlsx"
    ? "https://api.pdf.co/v1/pdf/convert/to/xlsx"
    : "https://api.pdf.co/v1/pdf/convert/to/doc";

  const convertResult = await httpPost(endpoint, {
    url: uploadResult.url,
    name: fileName.replace(".pdf", "." + format),
    inline: false,
  }, { "x-api-key": apiKey, "Content-Type": "application/json" });
  if (convertResult.error) throw new Error("PDF.co conversion error: " + convertResult.message);

  const outputPath = inputPath.replace(/\.pdf$/i, "." + format);
  await downloadFile(convertResult.url, outputPath);
  return outputPath;
}

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
        catch { resolve({ body: Buffer.concat(chunks).toString() }); }
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

// ── Raw MCP stdio Protocol (no SDK needed) ──
let buffer = "";

function log(msg) {
  process.stderr.write("[bid-leveling-mcp] " + msg + "\n");
}

function sendResponse(id, result) {
  const msg = JSON.stringify({ jsonrpc: "2.0", id, result });
  process.stdout.write("Content-Length: " + Buffer.byteLength(msg) + "\r\n\r\n" + msg);
}

function sendError(id, code, message) {
  const msg = JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } });
  process.stdout.write("Content-Length: " + Buffer.byteLength(msg) + "\r\n\r\n" + msg);
}

function sendNotification(method, params) {
  const msg = JSON.stringify({ jsonrpc: "2.0", method, params });
  process.stdout.write("Content-Length: " + Buffer.byteLength(msg) + "\r\n\r\n" + msg);
}

async function handleMessage(message) {
  const { id, method, params } = message;

  if (method === "initialize") {
    sendResponse(id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "bid-leveling-tools", version: "2.0.0" },
    });
    return;
  }

  if (method === "notifications/initialized") {
    return; // No response needed for notifications
  }

  if (method === "tools/list") {
    sendResponse(id, { tools: TOOLS });
    return;
  }

  if (method === "tools/call") {
    try {
      const text = await handleTool(params.name, params.arguments || {});
      sendResponse(id, { content: [{ type: "text", text }] });
    } catch (err) {
      sendResponse(id, { content: [{ type: "text", text: "Error: " + err.message }], isError: true });
    }
    return;
  }

  if (method === "ping") {
    sendResponse(id, {});
    return;
  }

  // Unknown method
  if (id !== undefined) {
    sendError(id, -32601, "Method not found: " + method);
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;

  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;

    const header = buffer.slice(0, headerEnd);
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.slice(headerEnd + 4);
      continue;
    }

    const contentLength = parseInt(match[1], 10);
    const bodyStart = headerEnd + 4;

    if (buffer.length < bodyStart + contentLength) break; // Wait for more data

    const body = buffer.slice(bodyStart, bodyStart + contentLength);
    buffer = buffer.slice(bodyStart + contentLength);

    try {
      const message = JSON.parse(body);
      handleMessage(message).catch(err => {
        log("Handler error: " + err.message);
        if (message.id !== undefined) {
          sendError(message.id, -32603, err.message);
        }
      });
    } catch (err) {
      log("Parse error: " + err.message);
    }
  }
});

process.stdin.on("end", () => process.exit(0));

log("Server started");
