export type AnyObject = Record<string, $TSFixMe>;
export type Ready<T, TK extends keyof T> = T & { [P in TK]-?: NonNullable<T[P]> };

export const typeAssert = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  shouldExtends<TImpl extends T, T>(): void {},
};
