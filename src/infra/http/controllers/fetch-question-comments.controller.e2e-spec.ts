import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import  request  from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'
import { DatabaseModule } from '../../../../src/infra/database/database.module'
import { AnswerFactory } from '../../../../test/factories/make-answer'
import { QuestionCommentFactory } from '../../../../test/factories/make-question-comment'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })

 test('[GET] /questions/:questionId/comments', async () => {
  const user = await studentFactory.makePrismaStudent()

  const accessToken = await jwtToken.signAsync({
    sub: user.id.toString(),
  })

  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

  await Promise.all([
    questionCommentFactory.makePrismaQuestionComment({ 
      authorId: user.id, 
      questionId: question.id, 
      content: 'Comment 1' 
    }),
    questionCommentFactory.makePrismaQuestionComment({ 
      authorId: user.id, 
      questionId: question.id, 
      content: 'Comment 2' 
    }),
  ])

  const questionId = question.id.toString()

  const response = await request(app.getHttpServer())
    .get(`/questions/${questionId}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send()

  expect(response.status).toBe(200)

  expect(response.body).toEqual({
    comments: expect.arrayContaining([
      expect.objectContaining({
        content: 'Comment 1',
      }),
      expect.objectContaining({
        content: 'Comment 2',
      }),
    ]),
  })
 })

})