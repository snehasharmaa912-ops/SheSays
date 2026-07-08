import { Resend } from 'resend'
import Contact from '../models/Contact.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendContact = async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    await Contact.create({ name, email, message })
    await resend.emails.send({
      from: 'SheSays <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL,
      subject: `New message from ${name} via SheSays`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    })

    res.status(201).json({ message: 'Message sent successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message })
  }
}
