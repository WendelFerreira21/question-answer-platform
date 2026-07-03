import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { jwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        signOptions: {
          algorithm: 'RS256',
        },

        privateKey: Buffer.from(
          config.getOrThrow<string>('JWT_PRIVATE_KEY'),
          'base64',
        ),

        publicKey: Buffer.from(
          config.getOrThrow<string>('JWT_PUBLIC_KEY'),
          'base64',
        ),
      }),
    }),
  ],

  providers: [
    jwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

  exports: [JwtModule],
})
export class AuthModule {}