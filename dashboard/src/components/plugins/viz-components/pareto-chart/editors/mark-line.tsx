import { Button, Collapse, SimpleGrid, Stack, Textarea } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMemo, useState } from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { IParetoChartConf } from '../type';

const getParamDescription = (note1: string, note2: string) => `
{
  // ${note1}
  percentage: {
    x: string; // 20%
    y: string; // 80%
  };
  count: {
    left: number; // 2
    right: number; // 8
  };

  // ${note2}
  x_axis: {
    name: string;
  };
  bar: {
    name: string;
  };
  line: {
    name: string;
  };
}
`;

export const DescribeParetoParams = () => {
  const { t, i18n } = useTranslation();
  const [opened, setOpened] = useState(false);

  const description = useMemo(() => {
    return getParamDescription(
      t('viz.pareto_chart.line_80_20.param_section_note_1'),
      t('viz.pareto_chart.line_80_20.param_section_note_2'),
    );
  }, [i18n.language]);
  return (
    <>
      <Button variant="subtle" compact onClick={() => setOpened((o) => !o)}>
        {opened ? t('common.actions.close') : t('viz.pareto_chart.line_80_20.click_to_see_params')}
      </Button>

      <Collapse in={opened}>
        <CodeHighlight language="typescript" withCopyButton={false} code={description} />
      </Collapse>
    </>
  );
};

interface IMarkLineField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function MarkLineField({ control, watch }: IMarkLineField) {
  const { t } = useTranslation();
  watch(['markLine']);
  return (
    <Stack>
      <SimpleGrid cols={2}>
        <Controller
          name="markLine.color"
          control={control}
          render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
        />
      </SimpleGrid>
      <Stack spacing={4}>
        <Controller
          name="markLine.label_template"
          control={control}
          render={({ field }) => (
            <Textarea
              autosize
              minRows={2}
              maxRows={4}
              label={t('viz.pareto_chart.line_80_20.label_template')}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
        <DescribeParetoParams />
      </Stack>
    </Stack>
  );
}
