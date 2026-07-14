import { Body, Controller, Post, UseGuards, BadRequestException, Param } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CommentOnAnswerUseCase } from "../../../../src/domain/forum/application/use-cases/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
    content: z.string(),
})

const BodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>


@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
    constructor( private commentOnAnswer: CommentOnAnswerUseCase) {}
    
    @Post()
    async handle(
        @Body(BodyValidationPipe) body: CommentOnAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string) {
        
        const { content } = body
        const userId = user.sub

       const result = await this.commentOnAnswer.execute({
            authorId: userId,
            content,
            answerId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}