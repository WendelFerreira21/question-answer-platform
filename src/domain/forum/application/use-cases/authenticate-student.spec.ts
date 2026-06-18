import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { FakeHasher } from '../../../../../test/crypotgraphy/fake-hasher'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { Encrypter } from '../crypotgraphy/encrypter'
import { FakeEncrypter } from '../../../../../test/crypotgraphy/fake-encrypter'
import { HashComparer } from '../crypotgraphy/hash-comparer'
import { makeStudent } from '../../../../../test/factories/make-student'


let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: HashComparer
let fakeEncrypter: Encrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to Authenticate a student', async () => {
    const student = makeStudent({
      email: 'john.doe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.items.push(student)
    
    const result = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
        acessToken: expect.any(String),
    })
  })

})