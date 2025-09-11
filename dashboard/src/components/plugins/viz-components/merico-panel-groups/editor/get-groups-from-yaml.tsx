import { Button, Stack, Textarea } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { MericoPanelGroupItem } from '../type';

function parseYaml(yamlContent: string) {
  try {
    const ret: MericoPanelGroupItem[] = [];
    const sections = yamlContent.split('\n');
    let comment = '';
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      if (s.includes('#')) {
        const c = s.split('# ')[1].trim();
        if (c) {
          comment = c;
          console.log({ comment });
        }
        continue;
      }
      const [name, panelIDString] = s.split(': ').map((s) => s.trim());
      console.log({ name, panelIDString });
      ret.push({
        name,
        comment,
        panelIDs: JSON.parse(panelIDString),
      });
    }
    return ret;
  } catch (error) {
    throw error;
  }
}

type Props = {
  onSubmit: (v: MericoPanelGroupItem[]) => void;
};
export const GetGroupsFromYAML = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const [opened, { setTrue: open, setFalse: onClose }] = useBoolean(false);
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue('');
  }, [opened]);

  const submit = () => {
    try {
      const parsed = parseYaml(value);
      onSubmit(parsed);
      onClose();
    } catch (e: any) {
      console.error(e);
      showNotification({
        title: t('viz.merico_panel_groups.groups.yaml.error_title'),
        message: e.message,
        color: 'red',
      });
    }
  };
  return (
    <>
      <Button onClick={open} disabled={opened} size="xs" variant="light">
        {t('viz.merico_panel_groups.groups.yaml.button')}
      </Button>
      <Modal
        opened={opened}
        onClose={onClose}
        title={t('viz.merico_panel_groups.groups.yaml.modal_title')}
        zIndex={340}
        size={800}
      >
        <Stack gap="lg">
          <Textarea
            label={t('viz.merico_panel_groups.groups.yaml.label')}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            autosize
            minRows={10}
            maxRows={40}
            styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
          />
          <Button ml="auto" onClick={submit}>
            {t('viz.merico_panel_groups.groups.yaml.submit')}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
