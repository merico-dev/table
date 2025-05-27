import { forwardRef } from 'react';
import classes from './item-badge.module.css';

type Props = {
  label: string;
  value: string;
};

export const ItemBadge = forwardRef<HTMLDivElement, Props>(({ label, value }, ref) => {
  return (
    <div ref={ref} className={classes.item_badge}>
      <div className={classes.label}>{label}</div>
      <div className={classes.value}>{value}</div>
    </div>
  );
});
