/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task | undefined {
    const foundedTask = this.tasks.find((task) => task.id === id);
    if (!foundedTask) {
      throw new NotFoundException(`TASK WITH id ${id} not found!`);
    } else {
      return foundedTask;
    }
  }

  deleteTaskById(id: string): void {
    const foundedTask = this.getTaskById(id);
    if (!foundedTask) return;

    this.tasks = this.tasks.filter((task) => task.id !== foundedTask.id);
  }

  updateTaskStatusById(id: string, status: TaskStatus): Task | void {
    const foundedTask = this.getTaskById(id);
    if (foundedTask) {
      foundedTask.status = status;
    }
    return foundedTask;
  }

  getTasksByQuery(filterDto: GetFilteredTasksDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }
}
