export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const fetchNewJobsRequest = await $fetch(`https://api.phantombuster.com/api/v2/agents/fetch-output?id=${config.keys.PHANTOMBUSTER_AGENT_ID}`,
    {
      method: "GET",      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Phantombuster-Key": config.keys.PHANTOMBUSTER_API_KEY
      }
    }).catch((error) => {
      console.log("log the error", error);
      return error;
    });

  return fetchNewJobsRequest;
});
