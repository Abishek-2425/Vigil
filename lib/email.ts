import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendDownAlert(to: string, monitorName: string, url: string) {
  await transporter.sendMail({
    from: `Vigil <${process.env.GMAIL_USER}>`,
    to,
    subject: `🔴 ${monitorName} is down`,
    text: `Your monitor "${monitorName}" (${url}) is not responding. We'll notify you when it recovers.`,
  })
}

export async function sendRecoveryAlert(to: string, monitorName: string, url: string) {
  await transporter.sendMail({
    from: `Vigil <${process.env.GMAIL_USER}>`,
    to,
    subject: `🟢 ${monitorName} is back up`,
    text: `Your monitor "${monitorName}" (${url}) has recovered and is responding normally.`,
  })
}