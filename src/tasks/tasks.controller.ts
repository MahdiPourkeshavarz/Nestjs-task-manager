/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-base-to-string */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';
import { GetFilteredTasksDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  private logger = new Logger('tasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetFilteredTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `user: ${user} retrieving tasks with filter ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task | undefined> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task | undefined> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`user: ${user} deleting tasks with ID ${id}`);
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/:status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<void | Task> {
    const { status } = updateTaskStatusDto;
    this.logger.verbose(
      `user: ${user} updating task status with ID ${id} with ${status}`,
    );
    return this.tasksService.updateTaskStatusById(id, status, user);
  }
}
