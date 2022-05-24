import { Column, PrimaryGeneratedColumn } from 'typeorm';

export type EscapedProperties = 'create_time' | 'update_time';

export class BaseModel {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '实体id',
  })
  id: string;

  @Column('timestamp with time zone', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'create_time',
  })
  create_time: Date;

  @Column('timestamp with time zone', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'update_time',
  })
  update_time: Date;
}
