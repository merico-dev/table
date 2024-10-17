import { Group, Popover, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar, IconMinus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { DateRangeValue } from '~/model';
import { Calendar } from './calendar';
import { CountDays } from './count-days';
import { Hints } from './hints';
import { Shortcuts } from './shortcuts';

const getInputStyles = (opened: boolean) => ({
  label: { display: 'block', height: '21.7px' },
  input: { borderColor: opened ? '#228be6' : '#e9ecef' },
});

type Props = {
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  label: string;
  required: boolean;
  inputFormat: string;
  allowSingleDateInRange: boolean;
  max_days: number;
  disabled?: boolean;
};
export const DateRangeWidget = ({
  label,
  required,
  value,
  onChange,
  max_days,
  allowSingleDateInRange,
  inputFormat,
  disabled,
}: Props) => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  const [begin, end] = value.value;
  const beginStr = begin ? dayjs(begin).format(inputFormat) : '';
  const endStr = end ? dayjs(end).format(inputFormat) : '';

  return (
    <Popover opened={opened} onClose={close} position="bottom-start" shadow="md">
      <Group justify="flex-start" grow wrap="nowrap" gap={0} w="288px" sx={{ marginTop: '3px' }}>
        <Popover.Target>
          <TextInput
            label={label}
            labelProps={{
              title: label,
            }}
            required={required}
            leftSection={<IconCalendar size={16} />}
            placeholder={t('filter.widget.date_range.start_date')}
            readOnly
            disabled={disabled}
            value={beginStr}
            onFocus={open}
            styles={getInputStyles(opened)}
            sx={{
              '.mantine-TextInput-label': {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: 'calc(240px)',
                position: 'relative',
                zIndex: 1,
              },
              '.mantine-Input-input': { borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            }}
          />
        </Popover.Target>
        <TextInput
          label={
            <Group justify="flex-end">
              <CountDays begin={begin} end={end} />
            </Group>
          }
          leftSection={<IconMinus size={16} />}
          placeholder={t('filter.widget.date_range.end_date')}
          readOnly
          disabled={!begin || disabled}
          value={endStr}
          onFocus={open}
          styles={getInputStyles(opened)}
          sx={{
            '.mantine-Input-icon': { transform: 'translateX(-22px)' },
            '.mantine-Input-input': { borderLeft: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
            '.mantine-Input-input[data-disabled]': {
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(to right, #fff 0%, #f1f3f5 30%)',
              opacity: 1,
            },
            '.mantine-Input-input[data-disabled]::placeholder': {
              opacity: 0.6,
            },
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
