import { Column, Entity } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class ApiKey extends BaseModel {
  @Column('character varying', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: false,
    name: 'app_id',
  })
  app_id: string;

  @Column('character varying', {
    nullable: false,
    name: 'app_secret',
  })
  app_secret: string;

  @Column('smallint', {
    nullable: false,
    default: 10,
    name: 'role_id',
  })
  role_id: number;

  @Column('boolean', {
    default: false,
    name: 'is_preset',
  })
  is_preset: boolean;
}
