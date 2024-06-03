import { Button, CloseButton, Group, Popover, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { useBoolean, useCreation } from 'ahooks';
import chroma from 'chroma-js';
import { range } from 'lodash';
import { makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IColorInterpolation, IValueStep } from '~/types/plugin';
import { formatNumber } from '~/utils';
import { useStyles } from './style';

const DEFAULT_STEPS: IValueStep[] = [
  { from: 0, to: 0 },
  { from: 100, to: 100 },
];

export interface IColorMappingEditorProps {
  steps: IValueStep[];
  onChange?: (steps: IValueStep[]) => void;
  interpolation: IColorInterpolation;
}

class ColorMappingEditorModel {
  /**
   * map toValue to fromValue
   */
  steps: Map<number, number> = new Map();
  interpolation!: IColorInterpolation;
  onChange: IColorMappingEditorProps['onChange'];

  constructor() {
    makeAutoObservable(
      this,
      {
        steps: observable,
      },
      { deep: false },
    );
    reaction(
      () => toJS(this.steps),
      () => {
        this.notifyStepChange();
      },
    );
  }

  setSteps(steps: IValueStep[]) {
    for (const step of steps) {
      this.steps.set(step.to, step.from);
    }
  }

  notifyStepChange() {
    this.onChange?.(
      Array.from(this.steps.entries())
        .map(([to, from]) => ({
          to,
          from,
        }))
        .sort((a, b) => a.to - b.to || a.from - b.from),
    );
  }

  fromProps(props: IColorMappingEditorProps) {
    if (props.steps.length < 2) {
      this.setSteps(DEFAULT_STEPS);
    } else {
      this.setSteps(props.steps);
    }
    this.interpolation = props.interpolation;
    this.onChange = props.onChange;
  }

  changeStep(fromVal: number | undefined | null, toVal: number) {
    if (fromVal == null) {
      this.steps.delete(toVal);
    } else {
      this.steps.set(toVal, fromVal);
    }
  }

  getStepFromValue(toValue: number): number | undefined {
    return this.steps.get(toValue);
  }
}

function getPaletteItemValueState(value?: number | null) {
  if (typeof value === 'number') {
    return String(value);
  }
  return undefined;
}

function PaletteItem(props: {
  index: number;
  color: string;
  value?: number | null;
  onChange?: (val?: number | null) => void;
}) {
  const { t } = useTranslation();
  const { onChange, color, index, value } = props;
  const { classes } = useStyles();
  const [state, setState] = useState(getPaletteItemValueState(value));
  const [popoverOpened, { setTrue: openPopover, setFalse: closePopover }] = useBoolean(false);
  const isOdd = index % 2 === 1;
  const showUpLabel = isOdd && value != null;
  const showBottomLabel = !isOdd && value != null;
  const textTitle = `map ${value} to color ${index}`;
  const handleCancel = () => {
    setState(getPaletteItemValueState(value));
    closePopover();
  };
  const handleOk = () => {
    closePopover();
    onChange?.(Number(state));
  };
  const handleRemove = () => {
    closePopover();
    onChange?.(null);
  };
  const valueText = formatNumber(value ?? null, {
    output: 'number',
    mantissa: 10,
    trimMantissa: true,
    average: true,
    absolute: false,
  });
  const invalid = !state || Number.isNaN(Number(state));

  return (
    <div data-testid={`palette-item-${index}`} className={classes.paletteItem}>
      <Text
        title={textTitle}
        style={{ opacity: showUpLabel ? 1 : 0 }}
        color="dimmed"
        size="sm"
        className="palette-value--up palette-value"
      >
        {valueText}
      </Text>
      <Popover width={240} trapFocus opened={popoverOpened} onClose={closePopover} zIndex={340} withinPortal>
        <Popover.Target>
          <div
            data-testid={`palette-item-target`}
            className="palette-item"
            onClick={openPopover}
            style={
              {
                '--shadow-color': chroma(color).alpha(0.5).hex(),
                backgroundColor: color,
              } as CSSProperties
            }
          />
        </Popover.Target>
        <Popover.Dropdown>
          <Tooltip withinPortal zIndex={340} label={t('common.actions.close')}>
            <CloseButton
              data-testid="palette-item-cancel"
              size="sm"
              color="gray"
              onClick={handleCancel}
              style={{
                position: 'absolute',
                top: '0.5em',
                right: '0.8em',
              }}
            />
          </Tooltip>
          <Stack>
            <TextInput
              size="xs"
              label={t('style.color.interpolation.palette.mapping.value_input_label')}
              value={state}
              onChange={(e) => {
                const v = e.currentTarget.value;
                setState(v);
              }}
              error={state && invalid}
            />
            <Group position="apart">
              <Button variant="light" color="red" size="xs" onClick={handleRemove} leftIcon={<IconTrash size={16} />}>
                {t('common.actions.delete')}
              </Button>

              <Button
                color="green"
                leftIcon={<IconDeviceFloppy size={16} />}
                data-testid="palette-item-ok"
                size="xs"
                onClick={handleOk}
                disabled={invalid}
              >
                {t('common.actions.save')}
              </Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
      <Text
        title={textTitle}
        style={{ opacity: showBottomLabel ? 1 : 0 }}
        color="dimmed"
        size="sm"
        className="palette-value--bottom palette-value"
      >
        {valueText}
      </Text>
    </div>
  );
}

const _ColorMappingEditor = observer(({ model }: { model: ColorMappingEditorModel }) => {
  const { classes } = useStyles();
  const colors = range(0, 13, 1)
    .map((i) => (100 / 12) * i)
    .map((val) => [model.interpolation.getColor(val), val] as const);
  return (
    <div className={classes.palette}>
      {colors.map(([color, toVal], i) => (
        <PaletteItem
          key={color}
          index={i}
          color={color}
          value={model.getStepFromValue(toVal)}
          onChange={(fromVal) => model.changeStep(fromVal, toVal)}
        />
      ))}
    </div>
  );
});

export const ColorMappingEditor = observer(function ColorMappingEditor(props: IColorMappingEditorProps) {
  const model = useCreation(() => new ColorMappingEditorModel(), []);
  useEffect(() => {
    model.fromProps(props);
  });

  if (model.interpolation == null) {
    return null;
  }
  return <_ColorMappingEditor model={model} />;
});
