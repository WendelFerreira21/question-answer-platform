import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

let schemaId: string

function generateUniqueDatabaseURL(schemaId: string) {
    if(!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variable')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schemaId)

    return url.toString()
}

beforeAll(async () => {
  schemaId = crypto.randomUUID()
  
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  execSync(`npx prisma migrate deploy --schema=./prisma/schema.prisma`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})