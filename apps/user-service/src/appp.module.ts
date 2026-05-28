import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MongoModule } from '@app/mongo';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    MongoModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: config.get('MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('FREELANCER_MARKETPLACE_USER_DB_HOST'),
        port: Number.parseInt(
          config.get<string>('FREELANCER_MARKETPLACE_USER_DB_PORT'),
          10,
        ),
        username: config.get<string>('FREELANCER_MARKETPLACE_USER_DB_USERNAME'),
        password: config.get<string>('FREELANCER_MARKETPLACE_USER_DB_PASSWORD'),
        database: config.get<string>(
          'FREELANCER_MARKETPLACE_USER_DB_DATABASE_NAME',
        ),
        synchronize: true,
      }),
    }),

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class UserServiceModule {}
