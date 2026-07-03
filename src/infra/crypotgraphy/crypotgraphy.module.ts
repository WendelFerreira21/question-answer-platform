import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { Encrypter } from '@/domain/forum/application/crypotgraphy/encrypter'
import { HashComparer } from '@/domain/forum/application/crypotgraphy/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/crypotgraphy/hash-generator'

import { JwtEncrypter } from './jwt.encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  imports: [
    JwtModule.register({
      privateKey: Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64'),
      publicKey: Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64'),
      signOptions: {
        algorithm: 'RS256',
      },
    }),
  ],

  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],

  exports: [
    Encrypter,
    HashComparer,
    HashGenerator,
  ],
})
export class CryptographyModule {}