import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class Config extends BaseModel {
  @Column('character varying', {
    nullable: false,
    name: 'resource_type',
  })
  resource_type: string;

  @Column('character varying', {
    nullable: true,
    name: 'resource_id',
  })
  resource_id: string;

  @Column('character varying', {
    nullable: false,
    name: 'key',
  })
  key: string;

  @Column('text', {
    nullable: false,
    name: 'value',
  })
  value: string;
}