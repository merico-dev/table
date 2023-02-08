import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class Job extends BaseModel {
  @Column('character varying', {
    nullable: false,
    primary: false,
    name: 'type',
  })
  type: string;

  @Column('character varying', {
    nullable: false,
    primary: false,
    name: 'status',
  })
  status: string;

  @Column('jsonb', { name: 'params' })
  params: Record<string, any>;

  @Column('jsonb', { name: 'result' })
  result: Record<string, any>;
}
