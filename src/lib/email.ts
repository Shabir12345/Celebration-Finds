export const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Skipping email send.");
    return { skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Celebration Finds <orders@celebrationfinds.com>",
        to: [to],
        subject,
        html,
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
