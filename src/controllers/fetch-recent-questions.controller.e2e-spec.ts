import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import  request  from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })

  beforeEach(async () => {
    await prisma.question.deleteMany()
    await prisma.user.deleteMany()
  })


  test('[GET] /questions', async () => {
  const user = await prisma.user.create({
    data: {
      name: 'Lautaro',
      email: `lautaro-${Date.now()}@example.com`,
      password: await hash('123456', 8),
    },
  })

  const accessToken = await jwtToken.signAsync({
    sub: user.id,
  })

  await prisma.question.createMany({
    data: [
      {
        title: ' Question 1',
        slug: 'question-1',
        content: 'Content for recent question 1',
        authorId: user.id,
      },
      {
        title: ' Question 2',
        slug: 'question-2',
        content: 'Content for recent question 2',
        authorId: user.id,
      },
    ],
  })

  const response = await request(app.getHttpServer())
    .get('/questions')
    .set('Authorization', `Bearer ${accessToken}`)

  expect(response.status).toBe(200)

  expect(response.body).toEqual({
    questions: expect.arrayContaining([
      expect.objectContaining({
        title: ' Question 1',
      }),
      expect.objectContaining({
        title: ' Question 2',
      }),
    ]),
  })
 })

})