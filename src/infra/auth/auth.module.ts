import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { EnvService } from "../env.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privatekey = env.get('JWT_PRIVATE_KEY')
        const publickey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privatekey, 'base64'), 
          publicKey: Buffer.from(publickey, 'base64'),   
        }
      },
    }),
  ],
  exports: [JwtModule],
  providers: [jwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AuthModule {}