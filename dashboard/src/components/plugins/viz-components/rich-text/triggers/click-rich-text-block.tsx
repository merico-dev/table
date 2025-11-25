import { Text, TextInput } from '@mantine/core';
import { defaults } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickRichTextBlock: ITriggerSchema = {
  id: 'builtin:rich-text:click-rich-text-block',
  displayName: 'viz.rich_text.click.label',
  nameRender: ClickRichTextBlockName,
  configRender: ClickRichTextBlockSettings,
  payload: [
    {
      name: 'variables',
      description: 'Panel variables',
      valueType: 'object',
    },
  ],
};

export interface IClickRichTextBlockConfig {
  blockId: string;
}

const DEFAULT_CONFIG: IClickRichTextBlockConfig = {
  blockId: '',
};

export function ClickRichTextBlockSettings(props: ITriggerConfigProps) {
  const { t } = useTranslation();
  const { value: config, set: setConfig } = useStorageData<IClickRichTextBlockConfig>(
    props.trigger.triggerData,
    'config',
  );
  const { blockId } = defaults({}, config, DEFAULT_CONFIG);

  const handleBlockIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void setConfig({ blockId: e.currentTarget.value });
  };

  return (
    <TextInput
      label={t('viz.rich_text.click.block_id_label')}
      description={t('viz.rich_text.click.block_id_description')}
      value={blockId}
      onChange={handleBlockIdChange}
      placeholder={t('viz.rich_text.click.block_id_placeholder')}
    />
  );
}

function ClickRichTextBlockName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  const { value: config } = useStorageData<IClickRichTextBlockConfig>(props.trigger.triggerData, 'config');
  const { blockId } = defaults({}, config, DEFAULT_CONFIG);

  if (blockId) {
    return <Text size="sm">{t('viz.rich_text.click.click_block_with_id', { blockId })}</Text>;
  }

  return <Text size="sm">{t('viz.rich_text.click.label')}</Text>;
}
