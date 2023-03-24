import { Entity, Column } from 'typeorm';
import { PermissionResource } from '../api_models/dashboard_permission';
import { BaseModel } from './base';

@Entity()
export default class DashboardPermission extends BaseModel {
  @Column('uuid', {
    name: 'owner_id',
    nullable: true,
  })
  owner_id: string | null;

  @Column('character varying', {
    name: 'owner_type',
    nullable: true,
  })
  owner_type: 'ACCOUNT' | 'APIKEY' | null;

  @Column('jsonb', {
    name: 'access',
    nullable: false,
  })
  access: PermissionResource[];
}
