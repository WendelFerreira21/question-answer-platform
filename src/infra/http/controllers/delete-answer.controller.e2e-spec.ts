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

describe('Delete answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let studentFactory: StudentFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })


  test('[DELETE] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = await jwtToken.signAsync({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
    .delete(`/answers/${answerId}`)
    .set('Authorization', `Bearer ${acessToken}`)
    .send()

    expect(response.status).toBe(204)

    const answerOnDatabase = await prisma.answer.findUnique({
        where: {
            id: answerId
        }
    })

    expect(answerOnDatabase).toBeNull()

  })

})