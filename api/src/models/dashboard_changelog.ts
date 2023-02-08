import { Entity, Column } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class DashboardChangelog extends BaseModel {
  @Column('uuid', {
    name: 'dashboard_id',
    comment: '报表ID',
  })
  dashboard_id: string;

  @Column('text', { name: 'diff' })
  diff: string;
}
