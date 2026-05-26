import { Body, Controller, Get, Post, Query, UseGuards, } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const pageQueryParamSchema = z
.string()
.optional()
.default('1')
.transform(Number)
.pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
    constructor( private prisma: PrismaService) {}
    
    @Get()
    async handle(@Query('page', queryValidationPipe) page:PageQueryParamSchema) {
       const PerPage = 20;
       
        const questions = await this.prisma.question.findMany({
           take: PerPage,
           skip: (page - 1) * 1,       
           orderBy: {
             createdAt: 'desc'
           }
        })

      return {questions};
    }
}