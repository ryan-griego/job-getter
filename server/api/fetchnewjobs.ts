export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const fetchNewJobsRequest = await $fetch("https://api.phantombuster.com/api/v2/agents/fetch-output?id=4512793125431671",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Phantombuster-Key": config.PHANTOMBUSTER_API_KEY
      }
    }).catch((error) => {
      console.log("log the error", error);
      return error;
    });
  return fetchNewJobsRequest;
});
