import { AppModule } from '../../app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import  request  from 'supertest'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'
import { DatabaseModule } from '../../../../src/infra/database/database.module'
import { Slug } from '../../../../src/domain/forum/enterprise/entities/value-objects/slug'

describe('get question by slug (E2E)', () => {
  let app: INestApplication
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],

    }).compile()

    app = moduleRef.createNestApplication()

    
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })


 test('[GET] /questions/:slug', async () => {
  const user = await studentFactory.makePrismaStudent()

  const accessToken = await jwtToken.signAsync({
    sub: user.id.toString()
  })

  await questionFactory.makePrismaQuestion({
    authorId: user.id,
    title: ' Question 01',
    slug: Slug.create('question-01'),
  })

  const response = await request(app.getHttpServer())
    .get(`/questions/question-01`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({title: ' Question 01'})
    })
 })

})