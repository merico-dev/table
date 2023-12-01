import { Button, Group, NumberInput, Popover, Stack, Text } from '@mantine/core';
import { useBoolean, useCreation } from 'ahooks';
import chroma from 'chroma-js';
import { range } from 'lodash';
import { makeAutoObservable, observable, reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { CSSProperties, useEffect, useState } from 'react';
import { useStyles } from '~/components/plugins/controls/color-mapping-editor/style';
import { IColorInterpolation, IValueStep } from '~/types/plugin';
import { formatNumber } from '~/utils';

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

  changeStep(fromVal: number | undefined, toVal: number) {
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

function PaletteItem(props: { index: number; color: string; value?: number; onChange?: (val?: number) => void }) {
  const { onChange, color, index, value } = props;
  const { classes } = useStyles();
  const [state, setState] = useState(value);
  const [popoverOpened, { setTrue: openPopover, setFalse: closePopover }] = useBoolean(false);
  const isOdd = index % 2 === 1;
  const showUpLabel = isOdd && value != null;
  const showBottomLabel = !isOdd && value != null;
  const textTitle = `map ${value} to color ${index}`;
  const handleCancel = () => {
    setState(value);
    closePopover();
  };
  const handleOk = () => {
    closePopover();
    onChange?.(state);
  };
  const valueText = formatNumber(value ?? null, { output: 'number', mantissa: 0, average: true, absolute: false });

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
      <Popover width={200} trapFocus opened={popoverOpened} onClose={closePopover}>
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
          <Stack>
            {/* @ts-expect-error type of onChange */}
            <NumberInput size="xs" label="Map a value to this color" value={state} onChange={setState} />
            <Group position="right">
              <Button variant="subtle" size="xs" onClick={handleCancel}>
                Cancel
              </Button>
              <Button data-testid="palette-item-ok" size="xs" onClick={handleOk}>
                OK
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
