import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.LOCAL_DATABASE_URL,
  connectionTimeoutMillis: 2000,
  max: 3,
})

const DB_TIMEOUT_MS = 2500
// Circuit breaker: once DB fails, skip all subsequent calls in this process
let dbDown = false

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  if (dbDown || !process.env.LOCAL_DATABASE_URL) return []
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DB timeout')), DB_TIMEOUT_MS)
    )
    const client = await Promise.race([pool.connect(), timeout])
    try {
      const result = await client.query(sql, params)
      return result.rows as T[]
    } finally {
      client.release()
    }
  } catch {
    dbDown = true
    return []
  }
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}
