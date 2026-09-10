import type { CollectionAfterChangeHook } from 'payload'

/**
 * Emails the site owner when a new contact-form Message lands.
 * Only fires on create; a failed send is logged, not thrown, so it never
 * blocks the submission.
 */
export const sendContactEmail: CollectionAfterChangeHook = async ({
  context,
  doc,
  operation,
  req,
}) => {
  if (context?.skipContactEmail) return doc
  if (operation !== 'create') return doc

  const to = process.env.CONTACT_NOTIFY_ADDRESS || process.env.EMAIL_FROM_ADDRESS
  if (!to) return doc

  try {
    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `New contact message: ${doc.subject}`,
      text: `From: ${doc.name} <${doc.email}>\nSubject: ${doc.subject}\n\n${doc.message}`,
    })
  } catch (err) {
    req.payload.logger.error({ err }, 'sendContactEmail: failed to send notification')
  }

  return doc
}
