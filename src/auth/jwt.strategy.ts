/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';
import { JwtPayload } from './jwt-payoad.interface';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  validate(...args: any[]): unknown {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'meitipk',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validateUser(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User | null = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
