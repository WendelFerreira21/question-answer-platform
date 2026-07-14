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
import { QuestionCommentFactory } from '../../../../test/factories/make-question-comment'
import { AnswerCommentFactory } from '../../../../test/factories/make-answer-comment'

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let studentFactory: StudentFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })


  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = await jwtToken.signAsync({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id
    })

    const answerCommentId = answerComment.id.toString()

    const response = await request(app.getHttpServer())
    .delete(`/answers/comments/${answerCommentId}`)
    .set('Authorization', `Bearer ${acessToken}`)
    .send()

    expect(response.status).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
        where: {
            id: answerCommentId
        }
    })

    expect(commentOnDatabase).toBeNull()

  })


})