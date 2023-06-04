import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class DashboardContentChangelog extends BaseModel {
  @Column('uuid', {
    name: 'dashboard_content_id',
    comment: '报表内容ID',
  })
  dashboard_content_id: string;

  @Column('text', { name: 'diff' })
  diff: string;
}
