import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { HashGenerator } from '../crypotgraphy/hash-generator'
import { FakeHasher } from '../../../../../test/crypotgraphy/fake-hasher'


let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: HashGenerator
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
        student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const hasherPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hasherPassword)
  })
})