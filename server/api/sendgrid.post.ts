export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  console.log("log the config", config);






  const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + bin,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    }).catch((error) => {
      return error;
    });

    console.log("log the result", sgRequest);
  return sgRequest;
});
