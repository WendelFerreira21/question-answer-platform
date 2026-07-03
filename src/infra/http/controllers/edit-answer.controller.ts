import { Body, Controller, Put, UseGuards, BadRequestException, HttpCode, Param } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { EditAnswerUseCase } from "../../../../src/domain/forum/application/use-cases/edit-answer";


const editAnswerBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const BodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>


@Controller('/answers/:id')
export class EditAnswerController {
    constructor( private editAnswer: EditAnswerUseCase) {}
    
    @Put()
    @HttpCode(204)
    async handle(
        @Body(BodyValidationPipe) body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string,
      ) {
        
        
        const { content } = body
        const userId = user.sub

       const result = await this.editAnswer.execute({
            content,
            answerId,
            authorId: userId,
            attachmentsIds: [],
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}