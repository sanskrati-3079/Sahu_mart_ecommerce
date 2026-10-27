#!/usr/bin/env node
// Verifies that every Unsplash image referenced in src/data actually loads.
// Usage: npm run check:images
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dataDir = new URL('../src/data/', import.meta.url).pathname
const ids = new Map()
for (const file of readdirSync(dataDir)) {
  const text = readFileSync(join(dataDir, file), 'utf8')
  for (const [, id] of text.matchAll(/['"](\d{10,13}-[0-9a-f]{12})['"]/g)) {
    if (!ids.has(id)) ids.set(id, file)
  }
}

console.log(`Checking ${ids.size} unique images…`)
const failures = []
const queue = [...ids.entries()]
async function worker() {
  while (queue.length) {
    const [id, file] = queue.shift()
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&q=50`
    try {
      const res = await fetch(url, { method: 'GET' })
      const type = res.headers.get('content-type') ?? ''
      if (!res.ok || !type.startsWith('image/')) failures.push({ id, file, status: res.status })
      await res.arrayBuffer()
    } catch (err) {
      failures.push({ id, file, status: String(err) })
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker))

if (failures.length) {
  console.error(`\n${failures.length} broken image(s):`)
  for (const f of failures) console.error(`  ${f.id}  (${f.file})  → ${f.status}`)
  process.exit(1)
}
console.log('All images load correctly.')
