import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Role {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    comment: '实体id',
  })
  id: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column('jsonb', {
    nullable: false,
    name: 'permissions',
  })
  permissions: string[];
}
