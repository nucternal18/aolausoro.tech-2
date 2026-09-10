import type { Field } from 'payload'

/**
 * Provenance pointer to the Mongoose `_id` from the pre-Payload `aolausoro`
 * database. Written only by the P3.2b migration script; read-only in admin.
 * Indexed (not unique — a unique index is non-sparse and would collide on
 * null for every admin-created doc). Idempotency is enforced by the script's
 * find-by-legacyId guard, not the DB.
 */
export const legacyIdField: Field = {
  name: 'legacyId',
  type: 'text',
  index: true,
  admin: {
    readOnly: true,
    position: 'sidebar',
    description: 'Migration provenance — original _id from the pre-Payload database.',
  },
}
