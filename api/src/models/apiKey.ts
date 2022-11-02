import { Column, Entity } from "typeorm";
import { BaseModel } from "./base";

@Entity()
export default class ApiKey extends BaseModel {
  @Column('character varying', {
    nullable: false,
    length: 100,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: false,
    length: 100,
    name: 'key',
  })
  key: string;

  @Column('character varying', {
    nullable: false,
    name: 'domain',
  })
  domain: string;

  @Column('smallint', {
    nullable: false,
    default: 10,
    name: 'role_id',
  })
  role_id: number;
}