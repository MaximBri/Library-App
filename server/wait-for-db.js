const net = require('net')

const host =
  process.env.DB_HOST ||
  (process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'db')
const port =
  Number(
    process.env.DB_PORT ||
      (process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).port : 5432)
  ) || 5432
const timeoutMs = Number(process.env.DB_WAIT_TIMEOUT_MS || 120000)
const retryInterval = Number(process.env.DB_WAIT_INTERVAL_MS || 2000)

function waitForPort(host, port, timeout) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    ;(function attempt() {
      const socket = new net.Socket()
      socket.setTimeout(2000)
      socket.once('error', () => {
        socket.destroy()
        if (Date.now() - start > timeout)
          return reject(new Error('Timeout waiting for DB'))
        setTimeout(attempt, retryInterval)
      })
      socket.once('timeout', () => {
        socket.destroy()
        if (Date.now() - start > timeout)
          return reject(new Error('Timeout waiting for DB'))
        setTimeout(attempt, retryInterval)
      })
      socket.connect(port, host, () => {
        socket.end()
        resolve()
      })
    })()
  })
}

;(async () => {
  console.log(`Waiting for DB at ${host}:${port} (timeout ${timeoutMs}ms)...`)
  try {
    await waitForPort(host, port, timeoutMs)
    console.log('DB is reachable.')
    process.exit(0)
  } catch (err) {
    console.error('DB did not become available:', err)
    process.exit(1)
  }
})()
