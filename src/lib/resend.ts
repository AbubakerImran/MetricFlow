import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set.");
  }
  return new Resend(apiKey);
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.APP_URL}/auth/verify?token=${token}`;
  await getResend().emails.send({
    from: "MetricFlow <noreply@metricflow.io>",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${token}`;
  await getResend().emails.send({
    from: "MetricFlow <noreply@metricflow.io>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}

export async function sendTeamInviteEmail(email: string, token: string, orgName: string) {
  const inviteLink = `${process.env.APP_URL}/invite/${token}`;
  await getResend().emails.send({
    from: "MetricFlow <noreply@metricflow.io>",
    to: email,
    subject: `You've been invited to ${orgName}`,
    html: `<p>You've been invited to join ${orgName} on MetricFlow. Click <a href="${inviteLink}">here</a> to accept.</p>`,
  });
}
