export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const scraperRequest = await $fetch("https://api.phantombuster.com/api/v2/agents/launch",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Phantombuster-Key": config.keys.PHANTOMBUSTER_API_KEY
      },
      body: JSON.stringify({ id: config.keys.PHANTOMBUSTER_AGENT_ID })
    }).catch((error) => {
      console.log("log the error", error);
      return error;
    });
  return scraperRequest;
});
