/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable prettier/prettier */

import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.model';
import { GetFilteredTasksDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('tasksRepo');
  async getTasks(filterDto: GetFilteredTasksDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    try {
      const tasks = await query.getMany();
      this.logger.log(`user: ${user} successfully retrieved tasks`);
      return tasks;
    } catch (error) {
      this.logger.error(
        `caught error ${error} during getting tasks with filters ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    try {
      await this.save(task);
      this.logger.log(`user: ${user} successfully created task: ${task}`);
      return task;
    } catch (error) {
      this.logger.error(
        `caught error ${error} during creating task`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
