export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send",
    {
      method: "POST",
      headers: {
        // Prevents me from going above the free tier emails
        Authorization: "Bearer " + config.SENDGRID_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    }).catch((error) => {
      console.log("log the type of error", typeof error);
      return error;
    });
  return sgRequest;
});
