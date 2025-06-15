import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(user: User, password: string): Promise<boolean> {
    return (user && bcrypt.compareSync(password, user.password));
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findUser(username: string): Promise<User | null | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const newUser = await this.userRepository.insert(
      {
        username,
        password: await bcrypt.hash(password, 10),
        role: username,
      }
    );
    return newUser.raw[0];
  }

  async userInfo(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
}
