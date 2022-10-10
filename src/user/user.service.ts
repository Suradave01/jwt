import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.UserRepository.find();
  }

  async register(data: any) {
    return this.UserRepository.save(data);
  }

  async login(data: any) {
    return this.UserRepository.findOneBy(data);
  }
}
