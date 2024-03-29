import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';
import { Content } from '../api_models/dashboard_content';

@Entity()
export default class DashboardContent extends BaseModel {
  @Column('uuid', {
    nullable: false,
    name: 'dashboard_id',
    comment: '报表ID',
  })
  dashboard_id: string;

  @Column('character varying', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('jsonb', {
    nullable: false,
    name: 'content',
  })
  content: Content;
}
