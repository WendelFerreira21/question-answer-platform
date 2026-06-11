import { Body, ConflictException, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { compare, hash } from "bcryptjs"
import {z} from 'zod'
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { JwtService } from "@nestjs/jwt";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>


@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
    
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body:CreateAccountBodySchema) {
       const { email, name, password } = body

       const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
            email,
        }
       })

       if(userWithSameEmail) {
          throw new ConflictException('Email already in use')
       }

       const hashedPassword = await hash(password, 10)

       await this.prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
       })

    }
}