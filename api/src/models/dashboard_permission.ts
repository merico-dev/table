import { Entity, Column } from 'typeorm';
import { PermissionResource } from '../api_models/dashboard_permission';
import { BaseModel } from './base';

@Entity()
export default class DashboardPermission extends BaseModel {
  @Column('uuid', {
    name: 'dashboard_id',
    comment: '报表ID',
    nullable: false,
  })
  dashboard_id: string;

  @Column('uuid', {
    name: 'owner_id',
    comment: '报表物主ID',
    nullable: true,
  })
  owner_id: string | null;

  @Column('character varying', {
    name: 'owner_type',
    comment: '报表物主类型',
    nullable: true,
  })
  owner_type: 'ACCOUNT' | 'APIKEY' | null;

  @Column('jsonb', {
    name: 'can_view',
    comment: '可以查看的授权列表',
    nullable: false,
  })
  can_view: PermissionResource[];

  @Column('jsonb', {
    name: 'can_edit',
    comment: '可以编辑的授权列表',
    nullable: false,
  })
  can_edit: PermissionResource[];
}
