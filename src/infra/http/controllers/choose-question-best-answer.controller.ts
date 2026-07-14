import { Body, Controller, Put, Patch, UseGuards, BadRequestException, HttpCode, Param } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { ChooseQuestionBestAnswerUseCase } from "../../../../src/domain/forum/application/use-cases/choose-question-best-answer";


@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
    constructor( private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}
    
    @Patch()
    @HttpCode(204)
    async handle(
        @Param('answerId') answerId: string,
        @CurrentUser() user: UserPayload) {
        const userId = user.sub

       const result = await this.chooseQuestionBestAnswer.execute({
            answerId,
            authorId: userId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}