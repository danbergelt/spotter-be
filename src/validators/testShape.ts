const { keys } = Object;

export type Shape<T> = {
  [K in keyof T]: T[K];
};

export const testShape = <T>(comp: Shape<T>) => (obj: object): boolean =>
  keys(obj).every(key => key in comp);
