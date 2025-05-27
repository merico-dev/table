import { forwardRef } from 'react';
import classes from './item-badge.module.css';
import { Tooltip } from '@mantine/core';

type Props = {
  label: string;
  value: string;
  tooltip?: string;
};

export const ItemBadge = forwardRef<HTMLDivElement, Props>(({ label, value, tooltip }, ref) => {
  return (
    <div ref={ref} className={classes.item_badge}>
      <div className={classes.label}>{label}</div>
      <Tooltip label={tooltip} disabled={!tooltip}>
        <div className={classes.value}>{value}</div>
      </Tooltip>
    </div>
  );
});
