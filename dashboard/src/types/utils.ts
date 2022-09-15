/* eslint-disable @typescript-eslint/no-explicit-$TSFixMe */
export type AnyObject = Record<string, $TSFixMe>;
export type Ready<T, TK extends keyof T> = T & { [P in TK]-?: NonNullable<T[P]> };
