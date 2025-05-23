require('dotenv').config()              // load .env in dev
import sgMail from '@sendgrid/mail'

// ── replace this hard-coded key ────────────────────────────────────────────────
// sgMail.setApiKey('***REMOVED***')

// ── with this ────────────────────────────────────────────────────────────────
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
