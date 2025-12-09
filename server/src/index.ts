import 'dotenv/config'
import { app } from './app'
import { initializeDatabase, disconnectDatabase } from './utils/db.init'

const PORT = process.env.PORT ?? 4000

async function start() {
  try {
    await initializeDatabase()

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })

    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server')
      await disconnectDatabase()
      process.exit(0)
    })

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server')
      await disconnectDatabase()
      process.exit(0)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
