import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base';

@Entity()
export default class SqlSnippet extends BaseModel {
  @PrimaryColumn('character varying', {
    nullable: false,
    name: 'id',
  })
  id: string;

  @Column('text', {
    nullable: false,
    name: 'content',
  })
  content: string;

  @Column('boolean', {
    default: false,
    name: 'is_preset',
  })
  is_preset: boolean;
}
