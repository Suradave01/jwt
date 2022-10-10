import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user: number;

  @Column()
  name: string;

  @Column()
  price: number;
}
