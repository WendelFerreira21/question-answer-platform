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

describe('Delete question comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let studentFactory: StudentFactory
  let jwtToken: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwtToken = moduleRef.get(JwtService)

    await app.init()
  })


  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = await jwtToken.signAsync({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
    })

    const questionComment = await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id
    })

    const questionCommentId = questionComment.id.toString()

    const response = await request(app.getHttpServer())
    .delete(`/questions/comments/${questionCommentId}`)
    .set('Authorization', `Bearer ${acessToken}`)
    .send()

    expect(response.status).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
        where: {
            id: questionCommentId
        }
    })

    expect(commentOnDatabase).toBeNull()

  })


})