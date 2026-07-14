import { Body, Controller, Get, Post, Query, UseGuards, BadRequestException, Param } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { FetchQuestionCommentsUseCase } from "../../../../src/domain/forum/application/use-cases/fetch-question-comments";
import { CommentPresenter } from "../presenters/comment-presenter";
import { FetchAnswerCommentsUseCase } from "../../../../src/domain/forum/application/use-cases/fetch-answer-comments";

const pageQueryParamSchema = z
.string()
.optional()
.default('1')
.transform(Number)
.pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>


@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
    constructor( private fetchAnswercomments: FetchAnswerCommentsUseCase) {}
    
    @Get()
    async handle(
    @Query('page', queryValidationPipe) page:PageQueryParamSchema,
    @Param('answerId') answerId: string
    ) {
       
      const result = await this.fetchAnswercomments.execute({
        page,
        answerId
      })

      if (result.isLeft()){
       throw new BadRequestException()
      }

      const answerComments = result.value.answerComments
        

      return {comments: answerComments.map(CommentPresenter.toHTTP)};
    }
}