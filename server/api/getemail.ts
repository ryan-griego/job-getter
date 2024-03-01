export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  let getEmailRequest;
  let incomingUrl = event.req.url;
  const urlParams = new URLSearchParams(incomingUrl.split('?')[1]);
  let url = `https://api.hunter.io/v2/email-finder?domain=${urlParams.get('domain')}&full_name=${urlParams.get('full_name')}&api_key=${config.HUNTER_API_KEY}`;
      getEmailRequest = await $fetch(url).catch((error) => {
      console.log("log the error", error);
      return error;
    });
  return getEmailRequest;
});
