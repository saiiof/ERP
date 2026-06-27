import express from 'express' 
import { connectDB } from './db/connection.js'
import { initApp } from './src/initApp.js'
const app = express()
const port = 3000


app.get('/', (req, res) => res.send('Hello World!'))

const bootstrap = async () => {
	await connectDB()
	initApp(app , express)
	app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

bootstrap().catch((err) => {
	console.error('Failed to start server:', err.message)
	process.exit(1)
})