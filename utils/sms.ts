import { formatE164ToGhanaLocal, formatGhanaPhoneToE164 } from "./phone-utils";

export async function sendSMS(phoneNumber: string, message: string) {
  try {
    const to = formatE164ToGhanaLocal(formatGhanaPhoneToE164(phoneNumber));
    await fetch(process.env.SMS_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: process.env.SMS_USERNAME,
        password: process.env.SMS_PASSWORD,
        source: process.env.SMS_SOURCE,
        destination: to,
        message,
      }),
    });

    console.log(`SMS sent to ${phoneNumber}`);
  } catch (error) {
    console.error("SMS sending error:", error);
  }
}
