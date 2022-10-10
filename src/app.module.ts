import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import { Products } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'users',
      entities: [User, Products],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Products]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService, ProductService],
})
export class AppModule {}
