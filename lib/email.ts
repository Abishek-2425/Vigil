import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDownAlert(to: string, monitorName: string, url: string) {
  await resend.emails.send({
    from: 'Vigil <onboarding@resend.dev>',
    to,
    subject: `🔴 ${monitorName} is down`,
    text: `Your monitor "${monitorName}" (${url}) is not responding. We'll notify you when it recovers.`,
  })
}

export async function sendRecoveryAlert(to: string, monitorName: string, url: string) {
  await resend.emails.send({
    from: 'Vigil <onboarding@resend.dev>',
    to,
    subject: `🟢 ${monitorName} is back up`,
    text: `Your monitor "${monitorName}" (${url}) has recovered and is responding normally.`,
  })
}