import { forwardRef, ReactNode } from 'react';
import classes from './item-badge.module.css';
import { HoverCard, Text } from '@mantine/core';

const HoverContent = ({ children }: { children: ReactNode }) => {
  if (['string', 'number'].includes(typeof children)) {
    return (
      <Text size="xs" ff="monospace">
        {children}
      </Text>
    );
  }
  return children;
};

type Props = {
  label: ReactNode;
  value: ReactNode;
  label_description?: ReactNode;
  value_description?: ReactNode;
};

export const ItemBadge = forwardRef<HTMLDivElement, Props>(
  ({ label, value, label_description, value_description }, ref) => {
    return (
      <div ref={ref} className={classes.item_badge}>
        {/* <HoverCard shadow="md" disabled={!label_description}>
          <HoverCard.Target>
            <div className={classes.label} data-with-tooltip={!!label_description}>
              {label}
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <HoverContent>{label_description}</HoverContent>
          </HoverCard.Dropdown>
        </HoverCard> */}
        <div className={classes.label}>{label}</div>
        <HoverCard shadow="md" disabled={!value_description}>
          <HoverCard.Target>
            <div className={classes.value} data-with-tooltip={!!value_description}>
              {value}
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown p="xs">
            <HoverContent>{value_description}</HoverContent>
          </HoverCard.Dropdown>
        </HoverCard>
      </div>
    );
  },
);
