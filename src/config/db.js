import { Pool } from 'pg'
import 'dotenv/config'
import bcrypt from 'bcrypt'

const hash = await bcrypt.hash('senha123', 10)              
const confere = await bcrypt.compare('senha123', hash)  

const sql = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'senai',
  database: process.env.DB_NAME || 'empresa'
})

export default sql
