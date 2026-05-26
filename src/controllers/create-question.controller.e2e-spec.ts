import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import  request  from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Create question (E2E)', () => {
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


  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Lautaro',
        email: `lautaro-${Date.now()}@example.com`,
        password: await hash('123456', 8),
      },
    })

    const acessToken = await jwtToken.signAsync({ sub: user.id })

    const response = await request(app.getHttpServer())
    .post('/questions')
    .set('Authorization', `Bearer ${acessToken}`)
    .send({
        title: 'New question',
        content: 'question content',
    })

    expect(response.status).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
        where: {
            title: 'New question'
        }
    })

    expect(questionOnDatabase).toBeTruthy()

  })

})