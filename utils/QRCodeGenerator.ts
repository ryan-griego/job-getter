  import QRCode from 'qrcode';

export async function generateQRCodeAndUpload(url, jobId, name, companyName, jobTitle) {

   const videoUrl = `https://ryangriego.com/intro-video?name=${name}&company=${companyName}&position=${jobTitle}`;

    const qrCodeDataUrl = await QRCode.toDataURL(videoUrl, { type: 'image/jpeg' });
    const base64Image = qrCodeDataUrl.split(',')[1];

    let uploadResponseData;

    try {
      const response = await useFetch("/api/uploadtocloudinary", {
        method: "POST",
        body: JSON.stringify({
          image: base64Image,
          type: 'image/jpeg'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      uploadResponseData = response;
      useNuxtApp().$toast.success('Upload to Cloudinary succeeded');

    } catch (error) {

      useNuxtApp().$toast.error('Upload to Cloudinary failed');
      console.error('Failed to upload QR code to Cloudinary:', error);
    }

    const rawValue = uploadResponseData?.data?._rawValue;

    console.log('log the rawValue when in QRGenrator util', rawValue);

    try {
      await useFetch("/api/updateshareableurl", {
        method: "POST",
        body: JSON.stringify({
          jobId: jobId,
          qrCodeUrl: rawValue?.body?.url,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      useNuxtApp().$toast.success('Updated shareable URL successfully');


    } catch (error) {
      useNuxtApp().$toast.error('Failed update QR code URL');
      console.error('Failed to update shareable URL:', error);
    }
  }
