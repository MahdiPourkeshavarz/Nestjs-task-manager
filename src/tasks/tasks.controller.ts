/* eslint-disable prettier/prettier */

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
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetFilteredTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
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
  getTaskById(@Param('id') id: string): Promise<Task | undefined> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/:status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<void | Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatusById(id, status);
  }
}
