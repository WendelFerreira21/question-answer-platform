import { Body, Controller, Put, UseGuards, BadRequestException, HttpCode, Param } from "@nestjs/common";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";


const editquestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const BodyValidationPipe = new ZodValidationPipe(editquestionBodySchema)

type EditquestionBodySchema = z.infer<typeof editquestionBodySchema>


@Controller('/questions/:id')
export class EditquestionController {
    constructor( private editquestion: EditQuestionUseCase) {}
    
    @Put()
    @HttpCode(204)
    async handle(
        @Body(BodyValidationPipe) body: EditquestionBodySchema,
        @Param('questionId') questionId: string,
        @CurrentUser() user: UserPayload) {
        
        const { title, content } = body
        const userId = user.sub

       const result = await this.editquestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
            questionId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}