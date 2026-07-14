import { CurrentUser } from "../../auth/current-user-decorator";
import { Body, Controller, Put, UseGuards, BadRequestException, HttpCode, Param, Delete } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { DeleteQuestionCommentUseCase } from "../../../../src/domain/forum/application/use-cases/delete-question-comment";


@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
    constructor( private deleteQuestionComment: DeleteQuestionCommentUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @Param('id') questionCommentId: string,
        @CurrentUser() user: UserPayload) {
        
        
        const result = await this.deleteQuestionComment.execute({
            questionCommentId,
            authorId: user.sub
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}