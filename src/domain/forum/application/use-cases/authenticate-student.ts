import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentRepository } from '../repositories/student-repository'
import { HasherComparer } from '../crypotgraphy/hasher-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Encrypter } from '../crypotgraphy/encrypter'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    acessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
   constructor(
      private studentRepository: StudentRepository,
      private hasherComparer: HasherComparer,
      private encrypter: Encrypter
    ) {}

  async execute({
    email,
    password,
    }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
        const student = await this.studentRepository.findByEmail(email)
    
        if(!student) {
            return left(new WrongCredentialsError())
        }
    
        const isPasswordValid = await this.hasherComparer.compare(password, student.password)
    
        if(!isPasswordValid) {
            return left(new WrongCredentialsError())
        }

        const acessToken = await this.encrypter.encrypt({ sub: student.id.toString() })

        return right({
          acessToken,
        })
    }
}