import { useState } from 'react'
import { sendContactMessage } from '../api.js'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus({ type: '', text: '' })
    try {
      await sendContactMessage(form)
      setStatus({ type: 'success', text: 'Message sent! We\'ll get back to you soon.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page contact-page">
      <h1>Get in Touch</h1>
      <p>Have a story, question, or feedback? Reach out — we're listening.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="6" value={form.message} onChange={handleChange} required />

        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>

        {status.text && <p className={`form-status ${status.type}`}>{status.text}</p>}
      </form>

      <p className="direct-email">
        Or email us directly at <a href="mailto:snehasharmaa912@gmail.com">snehasharmaa912@gmail.com</a>
      </p>
    </div>
  )
}
