import { Module } from '@nestjs/common';
import { DatabaseModuleClass } from './database.module-definition';

@Module({})
export class DatabaseModule extends DatabaseModuleClass {}
