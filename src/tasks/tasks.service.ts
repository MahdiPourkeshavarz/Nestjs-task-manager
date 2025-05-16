/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.model';
import { GetFilteredTasksDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetFilteredTasksDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string): Promise<Task> {
    const foundedTask = await this.taskRepository.findOne({ where: { id } });
    if (!foundedTask) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }
    return foundedTask;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this, this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string): Promise<void> {
    const res = await this.taskRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }
  }

  async updateTaskStatusById(
    id: string,
    status: TaskStatus,
  ): Promise<Task | void> {
    const foundedTask = await this.getTaskById(id);
    if (!foundedTask) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }
    foundedTask.status = status;
    await this.taskRepository.save(foundedTask);
    return foundedTask;
  }
}
