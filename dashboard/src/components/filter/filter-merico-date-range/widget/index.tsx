import { Box, Group, Popover, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar, IconMinus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';
import { Calendar } from './calendar';
import { CountDays } from './count-days';
import classes from './index.module.css';
import { SelectStep } from './select-step';
import { Shortcuts } from './shortcuts';
import { getMericoDateRangeShortcutValue } from './shortcuts/shortcuts';
import { formatDatesWithStep } from './utils';

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
  disabled?: boolean;
};
export const MericoDateRangeWidget = ({ label, required, value, onChange, inputFormat, disabled }: Props) => {
  const { t } = useTranslation();
  const [opened, { open, close: onClose }] = useDisclosure(false);

  const [begin, end] = value.value;
  const beginStr = begin ? dayjs(begin).format(inputFormat) : '';
  const endStr = end ? dayjs(end).format(inputFormat) : '';

  const handleCalendarChange = (v: DateRangeValue_Value) => {
    onChange({
      value: formatDatesWithStep(v[0], v[1], value.step),
      shortcut: null,
      step: value.step,
    });
  };

  const handleStepChange = (step: string) => {
    if (value.shortcut) {
      return onChange(getMericoDateRangeShortcutValue(value.shortcut, step)!);
    }

    onChange({
      value: formatDatesWithStep(value.value[0], value.value[1], step),
      shortcut: value.shortcut,
      step,
    });
  };

  return (
    <Popover opened={opened} onClose={onClose} position="bottom-start" shadow="md">
      <Group justify="flex-start" align="text-anchor" wrap="nowrap" gap={0} sx={{ marginTop: '3px' }}>
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
          label={<Box>&nbsp;</Box>}
          leftSection={<IconMinus size={16} onClick={open} />}
          placeholder={t('filter.widget.date_range.end_date')}
          readOnly
          disabled={!begin || disabled}
          value={endStr}
          onFocus={open}
          styles={getInputStyles(opened)}
          className={classes.end}
        />
        <SelectStep
          className={classes.step}
          value={value.step}
          onChange={handleStepChange}
          label={
            <Group justify="flex-end">
              <CountDays begin={begin} end={end} />
            </Group>
          }
        />
      </Group>
      <Popover.Dropdown p="sm">
        <Calendar value={value} onChange={handleCalendarChange} onClose={onClose} />
        <Shortcuts onChange={onChange} step={value.step} onClose={onClose} />
      </Popover.Dropdown>
    </Popover>
  );
};
