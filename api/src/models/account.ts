import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class Account extends BaseModel {
  @Column('character varying', {
    nullable: false,
    length: 100,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'email',
  })
  email: string | undefined;

  @Column('character varying', {
    nullable: false,
    length: 100,
    name: 'password',
  })
  password: string;

  @Column('smallint', {
    nullable: false,
    default: 10,
    name: 'role_id',
  })
  role_id: number;
}
