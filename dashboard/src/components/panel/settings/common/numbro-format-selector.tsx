import { Box, Button, Collapse, Group, NumberInput, Select, Stack, Switch, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, TNumberFormat, formatNumber } from '~/utils';
import { getSelectChangeHandler } from '~/utils/mantine';

const SwitchStyles = {
  root: {
    alignSelf: 'flex-end',
  },
  body: {
    alignItems: 'center',
  },
  label: {
    display: 'block',
  },
};

const numbersToPreview = ['123456789', '1234', '1234.56789', '1.234', '0.123456789', '-0.123456789'];

function PreviewNumberFormat({ format }: { format: TNumberFormat }) {
  const { t } = useTranslation();
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box>
      <Button
        variant="subtle"
        w="100%"
        size="compact-sm"
        onClick={toggle}
        leftSection={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
      >
        {opened ? t('numbro.format.preview.close') : t('numbro.format.preview.open')}
      </Button>

      <Collapse in={opened}>
        {opened && (
          <Table highlightOnHover sx={{ tableLayout: 'fixed' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('numbro.format.preview.input')}</Table.Th>
                <Table.Th>{t('numbro.format.preview.output')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {numbersToPreview.map((n) => (
                <Table.Tr key={n}>
                  <Table.Td>{n}</Table.Td>
                  <Table.Td>
                    <ErrorBoundary>{formatNumber(n, format)}</ErrorBoundary>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Collapse>
    </Box>
  );
}

interface INumbroFormatSelector {
  value: TNumberFormat;
  onChange: (v: TNumberFormat) => void;
}

function _NumbroFormatSelector({ value, onChange }: INumbroFormatSelector, ref: $TSFixMe) {
  const { t } = useTranslation();
  const changeOutput = (output: TNumberFormat['output']) => {
    onChange({ ...value, output });
  };
  const changeMantissa = (mantissa: TNumberFormat['mantissa'] | string) => {
    if (typeof mantissa === 'string') {
      return;
    }

    const trimMantissa = mantissa === 0 ? false : value.trimMantissa;
    onChange({ ...value, mantissa, trimMantissa });
  };
  const changeTrimMantissa = (event: $TSFixMe) => {
    onChange({ ...value, trimMantissa: event.currentTarget.checked });
  };
  const changeAverage = (event: $TSFixMe) => {
    onChange({ ...value, average: event.currentTarget.checked });
  };
  const changeAbsolute = (event: $TSFixMe) => {
    const payload = { ...value, absolute: event.currentTarget.checked };
    onChange(payload);
  };
  return (
    <Stack ref={ref}>
      <Group grow>
        <Select
          label={t('numbro.format.label')}
          data={[
            { label: '1234', value: 'number' },
            { label: '99%', value: 'percent' },
          ]}
          value={value.output}
          onChange={getSelectChangeHandler(changeOutput)}
          sx={{ flexGrow: 1 }}
        />
        <Switch
          label={
            <Stack gap={0}>
              <Text size="sm">{t('numbro.format.absolute')}</Text>
              <Text size="12px" c="gray">
                {t('numbro.format.absolute_description')}
              </Text>
            </Stack>
          }
          checked={value.absolute}
          onChange={changeAbsolute}
          sx={{ flexGrow: 1 }}
          styles={SwitchStyles}
        />
        <Switch
          label={
            <Stack gap={0}>
              <Text size="sm">{t('numbro.format.abbreviation')}</Text>
              <Text size="12px" c="gray">
                {t('numbro.format.abbreviation_description')}
              </Text>
            </Stack>
          }
          checked={value.average}
          onChange={changeAverage}
          disabled={value.output !== 'number'}
          sx={{ flexGrow: 1 }}
          styles={SwitchStyles}
        />
      </Group>
      <Group grow>
        <NumberInput
          label={t('numbro.format.mantissa')}
          defaultValue={0}
          min={0}
          step={1}
          max={4}
          value={value.mantissa}
          onChange={changeMantissa}
        />
        <Switch
          label={
            <Stack gap={0}>
              <Text size="sm">{t('numbro.format.trim_mantissa')}</Text>
              <Text size={'12px'} c="gray">
                {t('numbro.format.trim_mantissa_description')}
              </Text>
            </Stack>
          }
          checked={value.trimMantissa}
          onChange={changeTrimMantissa}
          disabled={value.mantissa === 0}
          styles={SwitchStyles}
        />
        <Box />
      </Group>
      <PreviewNumberFormat format={value} />
    </Stack>
  );
}

export const NumbroFormatSelector = React.forwardRef(_NumbroFormatSelector);
