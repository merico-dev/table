export interface Difference {
  path: string[];
  type: string;
  schemaType: string;
}

export interface SchemaNode {
  type: string;
}

export interface Patch {
  toJSON(): Difference[];
}

export interface IAccessor {
  readonly path: string[];

  in(obj: any): boolean;

  get(obj: any): any;

  set(obj: any, value: any): void;
}

export type DiffParams = { accessor: IAccessor; src: any; other: any; node: SchemaNode };
export type Differ = (params: DiffParams) => Difference[];
