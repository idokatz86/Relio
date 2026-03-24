const { BlobServiceClient } = require('@azure/storage-blob')
const { randomUUID } = require('crypto')

const CONTAINER = 'waitlist'
const BLOB_NAME = 'signups.csv'
const CSV_HEADER = 'id,email,first_name,created_at\n'

module.exports = async function (context, req) {
  try {
    const { email, first_name } = req.body || {}

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      context.res = {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Valid email is required' }),
      }
      return
    }

    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254)
    const sanitizedName = (first_name || '').trim().replace(/,/g, ' ').slice(0, 100)
    const id = randomUUID()
    const createdAt = new Date().toISOString()

    const csvRow = `${id},${sanitizedEmail},${sanitizedName},${createdAt}\n`

    const connStr = process.env.STORAGE_CONNECTION_STRING
    if (!connStr) {
      context.log.error('[Waitlist] STORAGE_CONNECTION_STRING not set')
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: "You're on the list!" }),
      }
      return
    }

    const blobService = BlobServiceClient.fromConnectionString(connStr)
    const container = blobService.getContainerClient(CONTAINER)
    await container.createIfNotExists()

    const blob = container.getAppendBlobClient(BLOB_NAME)
    await blob.createIfNotExists()

    // Check if header exists by checking blob size
    const props = await blob.getProperties()
    if (props.contentLength === 0) {
      await blob.appendBlock(CSV_HEADER, Buffer.byteLength(CSV_HEADER))
    }

    await blob.appendBlock(csvRow, Buffer.byteLength(csvRow))

    context.log('[Waitlist] Signup saved:', sanitizedEmail)

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: "You're on the list!" }),
    }
  } catch (err) {
    context.log.error('[Waitlist] Error:', err.message, err.stack)
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: "You're on the list!" }),
    }
  }
}
