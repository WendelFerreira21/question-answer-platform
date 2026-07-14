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
import { AnswerCommentFactory } from '../../../../test/factories/make-answer-comment'


describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory, AnswerFactory, AnswerCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    
    questionFactory = moduleRef.get(QuestionFactory)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })

 test('[GET] /answers/:answerId/comments', async () => {
  const user = await studentFactory.makePrismaStudent()

  const accessToken = await jwtToken.signAsync({
    sub: user.id.toString(),
  })

  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

  const answer = await answerFactory.makePrismaAnswer({
    authorId: user.id,
    questionId: question.id,
  })

  await Promise.all([
    answerCommentFactory.makePrismaAnswerComment({ 
      authorId: user.id, 
      answerId: answer.id, 
      content: 'Comment 1' 
    }),
    answerCommentFactory.makePrismaAnswerComment({ 
      authorId: user.id, 
      answerId: answer.id, 
      content: 'Comment 2' 
    }),
  ])

  const answerId = answer.id.toString()

  const response = await request(app.getHttpServer())
    .get(`/answers/${answerId}/comments`)
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