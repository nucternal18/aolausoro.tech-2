import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  try {
    await getPayload({ config })
    return Response.json({ status: 'ok' })
  } catch {
    return Response.json({ status: 'error' }, { status: 503 })
  }
}
