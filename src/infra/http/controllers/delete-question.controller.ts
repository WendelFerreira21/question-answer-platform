import { Body, Controller, Put, UseGuards, BadRequestException, HttpCode, Param, Delete } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";


@Controller('/questions/:id')
export class DeleteQuestionController {
    constructor( private deletequestion: DeleteQuestionUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @Param('id') questionId: string,
        @CurrentUser() user: UserPayload) {
        
        
        const result = await this.deletequestion.execute({
            questionId,
            authorId: user.sub
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}