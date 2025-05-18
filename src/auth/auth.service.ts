/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/await-thenable */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payoad.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    // private logger = new Logger('userService'),
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      // this.logger.log(
      //   `user: ${JSON.stringify(authCredentialsDto)} has successfully loggedIn`,
      // );
      return { accessToken };
    } else {
      // this.logger.error(
      //   `Login operation for user: ${JSON.stringify(authCredentialsDto)} failed!`,
      // );
      throw new UnauthorizedException('please check your login credentials');
    }
  }
}
