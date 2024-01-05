export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const key = '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';

  const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    }).catch((error) => {
      return error;
    });
  return sgRequest;
});
