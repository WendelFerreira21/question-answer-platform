import { CurrentUser } from "../../auth/current-user-decorator";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { Body, Controller, Put, UseGuards, BadRequestException, HttpCode, Param, Delete } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { DeleteAnswerUseCase } from "../../../../src/domain/forum/application/use-cases/delete-answer";


@Controller('/answers/:id')
export class DeleteAnswerController {
    constructor( private deleteanswer: DeleteAnswerUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @Param('id') answerId: string,
        @CurrentUser() user: UserPayload) {
        
        
        const result = await this.deleteanswer.execute({
            answerId,
            authorId: user.sub
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}