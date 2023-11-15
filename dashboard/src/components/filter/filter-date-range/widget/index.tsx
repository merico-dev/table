import { Group, Popover, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar, IconMinus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Calendar } from './calendar';
import { CountDays } from './count-days';
import { Hints } from './hints';
import { Shortcuts } from './shortcuts';
import { DateRangeValue } from './type';
const getInputStyles = (opened: boolean) => ({
  label: { display: 'block', height: '21.7px' },
  input: { borderColor: opened ? '#228be6' : '#e9ecef' },
});

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
      <Group position="left" grow noWrap spacing={0} w="18em" sx={{ marginTop: '3px' }}>
        <Popover.Target>
          <TextInput
            label={label}
            icon={<IconCalendar size={16} />}
            placeholder="Start date"
            readOnly
            value={beginStr}
            onFocus={open}
            styles={getInputStyles(opened)}
            sx={{
              '.mantine-Input-input': { borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            }}
          />
        </Popover.Target>
        <TextInput
          label={
            <Group position="right">
              <CountDays begin={begin} end={end} />
            </Group>
          }
          icon={<IconMinus size={16} />}
          placeholder="End date"
          readOnly
          disabled={!begin}
          value={endStr}
          onFocus={open}
          styles={getInputStyles(opened)}
          sx={{
            '.mantine-Input-icon': { transform: 'translateX(-22px)' },
            '.mantine-Input-input': { borderLeft: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
          }}
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
