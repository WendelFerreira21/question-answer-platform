import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentRepository } from '../repositories/student-repository'
import { HasherGenerator } from '../crypotgraphy/hasher-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
   constructor(
      private studentRepository: StudentRepository,
      private hasherGenerator: HasherGenerator
    ) {}

  async execute({
    name,
    email,
    password,
    }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
        const studentWithSameEmail = await this.studentRepository.findByEmail(email)
    
        if(studentWithSameEmail) {
            return left(new StudentAlreadyExistsError(email))
        }
    
        const hashedPassword = await this.hasherGenerator.hash(password)
    
        const student = Student.create({
            name,
            email,
            password: hashedPassword,
        })

        await this.studentRepository.create(student)

        return right({
          student,
        })
    }
}