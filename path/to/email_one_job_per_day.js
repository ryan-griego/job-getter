require('dotenv').config()              // load .env in dev
import sgMail from '@sendgrid/mail'

// ── Use environment variable for API key ──────────────────────────────────────
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
