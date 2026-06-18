import { Module } from '@nestjs/common'
import { Encrypter } from '@/domain/forum/application/crypotgraphy/encrypter'

import { JwtEncrypter } from './jwt.encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { HashComparer } from '@/domain/forum/application/crypotgraphy/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/crypotgraphy/hash-generator'


@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}