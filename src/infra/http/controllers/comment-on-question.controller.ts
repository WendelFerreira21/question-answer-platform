import { Body, Controller, Post, UseGuards, BadRequestException, Param } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CommentOnQuestionUseCase } from "../../../../src/domain/forum/application/use-cases/comment-on-question";


const commentOnQuestionBodySchema = z.object({
    content: z.string(),
})

const BodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>


@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
    constructor( private commentOnQuestion: CommentOnQuestionUseCase) {}
    
    @Post()
    async handle(
        @Body(BodyValidationPipe) body: CommentOnQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string) {
        
        const { content } = body
        const userId = user.sub

       const result = await this.commentOnQuestion.execute({
            authorId: userId,
            content,
            questionId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}