import { Group, Popover, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { Calendar } from './calendar';
import { CountDays } from './count-days';
import { Hints } from './hints';
import { Shortcuts } from './shortcuts';
import { DateRangeValue } from './type';
import { IconCalendar, IconX } from '@tabler/icons-react';
const inputStyles = {
  label: { display: 'block', height: '22px' },
};

type Props = {
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  label: string;
  inputFormat: string;
  allowSingleDateInRange: boolean;
  max_days: number;
};
export const DateRangeWidget = ({ label, value, onChange, max_days, allowSingleDateInRange, inputFormat }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [begin, end] = value;
  const beginStr = begin ? dayjs(begin).format(inputFormat) : '';
  const endStr = end ? dayjs(end).format(inputFormat) : '';

  return (
    <Popover opened={opened} onClose={close} position="bottom-start" shadow="md">
      <Group position="left" grow noWrap spacing={6} w="19em">
        <Popover.Target>
          <TextInput
            label={label}
            icon={<IconCalendar size={16} />}
            placeholder="Start date"
            styles={inputStyles}
            readOnly
            value={beginStr}
            onFocus={open}
          />
        </Popover.Target>
        <TextInput
          label={
            <Group position="right">
              <CountDays begin={begin} end={end} />
            </Group>
          }
          placeholder="End date"
          readOnly
          disabled={!begin}
          value={endStr}
          onFocus={open}
          styles={inputStyles}
        />
      </Group>
      <Popover.Dropdown p="sm">
        <Hints max_days={max_days} />
        <Calendar
          value={value}
          onChange={onChange}
          close={close}
          allowSingleDateInRange={allowSingleDateInRange}
          max_days={max_days}
        />
        <Shortcuts onChange={onChange} />
      </Popover.Dropdown>
    </Popover>
  );
};
