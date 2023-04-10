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

  @Column('uuid', {
    name: 'content_id',
    comment: '报表内容ID',
  })
  content_id: string;

  @Column('boolean', {
    default: false,
    name: 'is_removed',
  })
  is_removed: boolean;

  @Column('boolean', {
    default: false,
    name: 'is_preset',
  })
  is_preset: boolean;

  @Column('character varying', {
    nullable: false,
    default: '',
    name: 'group',
  })
  group: string;
}
