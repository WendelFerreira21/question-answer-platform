import { Body, Controller, Post, UseGuards, BadRequestException, Param } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateQuestionUseCase } from "../../../../src/domain/forum/application/use-cases/create-question";
import { AnswerQuestionUseCase } from "../../../../src/domain/forum/application/use-cases/answer-question";

const answerquestionBodySchema = z.object({
    content: z.string(),
})

const BodyValidationPipe = new ZodValidationPipe(answerquestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerquestionBodySchema>


@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
    constructor( private answerquestion: AnswerQuestionUseCase) {}
    
    @Post()
    async handle(
        @Body(BodyValidationPipe) body: AnswerQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string) {
        
        const { content } = body
        const userId = user.sub

       const result = await this.answerquestion.execute({
            authorId: userId,
            content,
            questionId,
            attachmentsIds: [],
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}