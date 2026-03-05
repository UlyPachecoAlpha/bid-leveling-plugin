const axios = require("axios");

async function triggerFlow() {
  const url = "https://ce34d4adca74eb6483db3ed4881cc5.15.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4ded1c4f582e4604885ddb3e50481eb4/triggers/manual/paths/invoke?api-version=1";

  const payload = {
    action: "do_something",
    title: "Test Claude to PA Webhook",
    priority: "high"
  };

  const res = await axios.post(url, payload);

  console.log(res.data);
}

triggerFlow();
