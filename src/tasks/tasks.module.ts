/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController]
})
export class TasksModule {}
