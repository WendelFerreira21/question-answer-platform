import { Body, Controller, Post, UseGuards, BadRequestException } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import type { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateQuestionUseCase } from "../../../../src/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const BodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>


@Controller('/questions')
export class CreateQuestionController {
    constructor( private createQuestion: CreateQuestionUseCase) {}
    
    @Post()
    async handle(
        @Body(BodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload) {
        
        const { title, content } = body
        const userId = user.sub

       const result = await this.createQuestion.execute({
            authorId: userId,
            title,
            content,
            attachmentsIds: [],
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}