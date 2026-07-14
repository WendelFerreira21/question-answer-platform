import { CurrentUser } from "../../auth/current-user-decorator";
import { Body, Controller, Put, UseGuards, BadRequestException, HttpCode, Param, Delete } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "../../../../src/domain/forum/application/use-cases/delete-answer-comment";


@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
    constructor( private deleteAnswerComment: DeleteAnswerCommentUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @Param('id') answerCommentId: string,
        @CurrentUser() user: UserPayload) {
        
        
        const result = await this.deleteAnswerComment.execute({
            answerCommentId,
            authorId: user.sub
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}