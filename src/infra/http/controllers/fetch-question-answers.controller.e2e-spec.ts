import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import  request  from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'
import { DatabaseModule } from '../../../../src/infra/database/database.module'
import { AnswerFactory } from '../../../../test/factories/make-answer'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
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
    
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })

 test('[GET] /questions/:questionId/answers', async () => {
  const user = await studentFactory.makePrismaStudent()

  const accessToken = await jwtToken.signAsync({
    sub: user.id.toString(),
  })

  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

  await Promise.all([
    answerFactory.makePrismaAnswer({ 
      authorId: user.id, 
      questionId: question.id, 
      content: 'Answer 1' 
    }),
    answerFactory.makePrismaAnswer({ 
      authorId: user.id, 
      questionId: question.id, 
      content: 'Answer 2' 
    }),
  ])

  const questionId = question.id.toString()

  const response = await request(app.getHttpServer())
    .get(`/questions/${questionId}/answers`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send()

  expect(response.status).toBe(200)

  expect(response.body).toEqual({
    answers: expect.arrayContaining([
      expect.objectContaining({
        content: 'Answer 1',
      }),
      expect.objectContaining({
        content: 'Answer 2',
      }),
    ]),
  })
 })

})