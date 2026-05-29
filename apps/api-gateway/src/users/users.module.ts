import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersClientProxy } from './user-client.proxy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3301 },
      },
    ]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],

  controllers: [UsersController],
  providers: [UsersClientProxy, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [UsersClientProxy, ClientsModule], // 👈 quan trọng
})
export class UsersModule {}
