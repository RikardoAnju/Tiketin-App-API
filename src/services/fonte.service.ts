type SendWhatsappParams = {
  target: string;
  message: string;
};

export async function sendWhatsappMessage({ target, message }: SendWhatsappParams) {
  const response = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: process.env.FONNTE_TOKEN!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target,
      message,
      countryCode: "62",
    }),
  });

  const result = await response.json();

  if (!response.ok || result?.status === false || result?.Status === false) {
    throw new Error(result?.reason || "Gagal kirim OTP WhatsApp");
  }

  return result;
}