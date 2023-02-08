import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Role {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    comment: '实体id',
  })
  id: string;

  @Column('character varying', {
    nullable: false,
    length: 100,
    name: 'name',
  })
  name: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;
}
