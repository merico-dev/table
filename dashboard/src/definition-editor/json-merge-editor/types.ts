import { Accessor } from '@zeeko/power-accessor';
import { ReactNode } from 'react';

export interface IDiffTarget<T, TId> {
  selector: Accessor<object, object>;
  idSelector: (item: T) => TId;
  formatDisplayName: (item: T) => ReactNode;
}
