import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'libs/user/entities/account.entity';
import { UserEntity } from 'libs/user/entities/user.entity';
import { ProfileEntity } from 'libs/user/entities/profile.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', // hoặc mysql / sqlite tuỳ bạn
        host: config.get<string>('FREELANCER_MARKETPLACE_USER_DB_HOST'),
        port: +config.get<number>('FREELANCER_MARKETPLACE_USER_DB_PORT'),
        username: config.get<string>('FREELANCER_MARKETPLACE_USER_DB_USERNAME'),
        password: config.get<string>('FREELANCER_MARKETPLACE_USER_DB_PASSWORD'),
        database: config.get<string>(
          'FREELANCER_MARKETPLACE_USER_DB_DATABASE_NAME',
        ),
        entities: [AccountEntity, UserEntity, ProfileEntity],
        synchronize: false,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
