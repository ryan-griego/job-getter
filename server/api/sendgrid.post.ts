export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

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



// export default defineEventHandler(async (event) => {s
//   const config = useRuntimeConfig();
//   const body = await readBody(event);
//   console.log("log the config", config);

//   console.log("log the info", config.SENDGRID_API_KEY);
// console.log("log bin", bin);





//   const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send",
//     {
//       method: "POST",
//       headers: {
//         Authorization: "Bearer " + config.SENDGRID_API_KEY,
//         "Content-Type": "application/json",
//         Accept: "application/json"
//       },
//       body: JSON.stringify(body)
//     }).catch((error) => {
//       return error;
//     });

//     console.log("log the result", sgRequest);
//   return sgRequest;
// });
