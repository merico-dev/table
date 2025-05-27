import { forwardRef } from 'react';
import classes from './item-badge.module.css';
import { Tooltip } from '@mantine/core';

type Props = {
  label: string;
  value: string;
  label_tooltip?: string;
  value_tooltip?: string;
};

export const ItemBadge = forwardRef<HTMLDivElement, Props>(({ label, value, label_tooltip, value_tooltip }, ref) => {
  return (
    <div ref={ref} className={classes.item_badge}>
      <Tooltip label={label_tooltip} disabled={!label_tooltip}>
        <div className={classes.label}>{label}</div>
      </Tooltip>
      <Tooltip label={value_tooltip} disabled={!value_tooltip}>
        <div className={classes.value}>{value}</div>
      </Tooltip>
    </div>
  );
});
