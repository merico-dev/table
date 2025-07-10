import { Group, Popover, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar, IconMinus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';
import { Calendar } from './calendar';
import { CountDays } from './count-days';
import { Shortcuts } from './shortcuts';
import { SelectStep } from './select-step';
import classes from './index.module.css';

const getInputStyles = (opened: boolean) => ({
  label: { display: 'block', height: '21.7px' },
  input: { borderColor: opened ? '#228be6' : '#e9ecef' },
});

type Props = {
  value: MericoDateRangeValue;
  onChange: (v: MericoDateRangeValue) => void;
  label: string;
  required: boolean;
  inputFormat: string;
  allowSingleDateInRange: boolean;
  disabled?: boolean;
};
export const MericoDateRangeWidget = ({
  label,
  required,
  value,
  onChange,
  allowSingleDateInRange,
  inputFormat,
  disabled,
}: Props) => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  const [begin, end] = value.value;
  const beginStr = begin ? dayjs(begin).format(inputFormat) : '';
  const endStr = end ? dayjs(end).format(inputFormat) : '';

  const handleCalendarChange = (v: DateRangeValue_Value) => {
    onChange({
      value: v,
      shortcut: null,
      step: value.step,
    });
  };

  return (
    <Popover opened={opened} onClose={close} position="bottom-start" shadow="md">
      <Group justify="flex-start" align="text-anchor" grow wrap="nowrap" gap={0} w="388px" sx={{ marginTop: '3px' }}>
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
            className={classes.begin}
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
          className={classes.end}
        />
        <SelectStep value={value} onChange={onChange} />
      </Group>
      <Popover.Dropdown p="sm">
        <Calendar
          value={value}
          onChange={handleCalendarChange}
          close={close}
          allowSingleDateInRange={allowSingleDateInRange}
        />
        <Shortcuts onChange={onChange} step={value.step} />
      </Popover.Dropdown>
    </Popover>
  );
};
