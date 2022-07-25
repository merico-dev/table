import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class Dashboard extends BaseModel {
  @Column('character varying', {
    nullable: false,
    primary: false,
    name: 'name',
  })
  name: string;

  @Column('jsonb', { name: 'content' })
  content: Record<string, any>;

  @Column('boolean', {
    default: false,
    name: 'is_removed',
  })
  is_removed: boolean;
}