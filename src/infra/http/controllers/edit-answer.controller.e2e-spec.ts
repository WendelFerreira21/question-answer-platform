import { AppModule } from '../../app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import  request  from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from '../../../../test/factories/make-student'
import { DatabaseModule } from '../../../../src/infra/database/database.module'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { AnswerFactory } from '../../../../test/factories/make-answer'

describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = await jwtToken.signAsync({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
    .put(`/answers/${answerId}`)
    .set('Authorization', `Bearer ${acessToken}`)
    .send({
        content: 'New answer content',
    })

    expect(response.status).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
        where: {
            content: 'New answer content'
        }
    })

    expect(answerOnDatabase).toBeTruthy()

  })

})