import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtStrategy } from "./jwt.strategy";
import { Env } from "../env";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privatekey = config.get('JWT_PRIVATE', { infer: true })
        const publickey = config.get('JWT_PUBLIC', { infer: true })

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privatekey, 'base64'), 
          publicKey: Buffer.from(publickey, 'base64'),   
        }
      },
    }),
  ],
  exports: [JwtModule],
  providers: [jwtStrategy]
})
export class AuthModule {}