import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';
import { DataSourceConfig } from '../api_models/datasource';

@Entity()
export default class DataSource extends BaseModel {
  @Column('character varying', {
    nullable: false,
    primary: false,
    name: 'type',
  })
  type: string;

  @Column('character varying', {
    nullable: false,
    primary: false,
    name: 'key',
  })
  key: string;

  @Column('jsonb', { name: 'config' })
  config: DataSourceConfig;

  @Column('boolean', {
    default: false,
    name: 'is_preset',
  })
  is_preset: boolean;
}