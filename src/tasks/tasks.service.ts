// src/tasks/tasks.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/tasks.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(title: string, assignedTo: User): Promise<Task> {
    const task = new this.taskModel({ title, assignedTo });
    return task.save();
  }

  async getTasksForUser(user: User): Promise<Task[]> {
    return this.taskModel.find({ assignedTo: user._id }).exec();
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async updateTask(id: string, title: string, completed: boolean): Promise<Task> {
    const task = await this.getTaskById(id);
    task.title = title;
    task.completed = completed;
    return task.save();
  }

  async deleteTask(id: string): Promise<unknown> {
    const task = await this.taskModel.deleteOne({id});
    return task;
  }

  private async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }
}
