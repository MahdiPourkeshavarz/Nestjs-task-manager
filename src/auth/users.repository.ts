/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */

import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('usersRepo');
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.save(user);
      this.logger.log(
        `user: ${JSON.stringify(authCredentialsDto)} successfully created`,
      );
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        this.logger.error(
          `failed to created user ${JSON.stringify(authCredentialsDto)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }
}
