/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyObject = Record<string, any>;
export type Ready<T, TK extends keyof T> = T & { [P in TK]-?: NonNullable<T[P]> };
