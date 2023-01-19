import { SchemaNode } from './core';

export interface IdNode {
  type: 'id';
}

export interface StringNode {
  type: 'string';
}

export interface DictionaryNode {
  type: 'dictionary';
  name: string;
  fields: [string, SchemaNode][];
}
