import { Divider, Select, Stack, Switch } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { IViewConfigModel_Tabs } from '~/model/views/view/tabs';
import { EViewComponentType } from '~/types';

const tabVariantOptions = [
  {
    value: 'default',
    label: 'Default',
  },
  {
    value: 'outline',
    label: 'Outline',
  },
  {
    value: 'pills',
    label: 'Pills',
  },
];

const tabOrientationOptions = [
  {
    value: 'horizontal',
    label: 'Horizontal',
  },
  {
    value: 'vertical',
    label: 'Vertical',
  },
];

export const ViewTabsConfigFields = observer(() => {
  const model = useModelContext();
  const VIE = model.views.VIE;
  if (!VIE || VIE.type !== EViewComponentType.Tabs) {
    return null;
  }
  const config = VIE.config as IViewConfigModel_Tabs;
  return (
    <Stack>
      <Divider mt={8} mb={0} label="Tabs settings" labelPosition="center" />
      <Select label="Variant" value={config.variant} onChange={config.setVariant} data={tabVariantOptions} />
      <Select
        label="Orientation"
        value={config.orientation}
        onChange={config.setOrientation}
        data={tabOrientationOptions}
      />
      <Switch label="Grow Tabs" checked={config.grow} onChange={(e) => config.setGrow(e.currentTarget.checked)} />
    </Stack>
  );
});
