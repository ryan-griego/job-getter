export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const scraperRequest = await $fetch("https://api.phantombuster.com/api/v2/agents/launch",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Phantombuster-Key": config.PHANTOMBUSTER_API_KEY
      },
      body: JSON.stringify({ id: '7475608618187742' })
    }).catch((error) => {
      console.log("log the error", error);
      return error;
    });
    console.log("log the scraperequest", scraperRequest);
  return scraperRequest;
});
