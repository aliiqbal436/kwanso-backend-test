import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuardJWT } from '../utils/auth.gaurd';
import { TasksService } from './tasks.service';
import { Task } from '../schemas/tasks.schema';
import { UsersService } from 'src/users/users.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly usersService: UsersService) {}

  @UseGuards(AuthGuardJWT)
  @Post()
  async createTask(@Request() req, @Body('title') title: string, @Body('assignedTo') assignedTo: string): Promise<Task> {
    if (req.user && req.user.isAdmin) {
      // Admin can assign tasks to any user
      const assignedUser = await this.usersService.findById(assignedTo);
      return this.tasksService.createTask(title, assignedUser);
    } else {
      // Regular users can only create tasks for themselves
      const user = req.user; // Assuming user details are stored in the request object
      return this.tasksService.createTask(title, user);
    }
  }

  @UseGuards(AuthGuardJWT)
  @Get('user')
  async getTasksForUser(@Request() req): Promise<Task[]> {
    const user = req.user;
    return this.tasksService.getTasksForUser(user);
  }

  @UseGuards(AuthGuardJWT)
  @Get('all')
  async getAllTasks(@Request() req): Promise<Task[]> {
    if (req.user && req.user.isAdmin) {
      // Admin can see all tasks
      return this.tasksService.getAllTasks();
    } else {
      // Regular users can only see their own tasks
      const user = req.user;
      return this.tasksService.getTasksForUser(user);
    }
  }

  @UseGuards(AuthGuardJWT)
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('completed') completed: boolean,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, title, completed);
  }

  @UseGuards(AuthGuardJWT)
  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<unknown> {
    return this.tasksService.deleteTask(id);
  }
}
