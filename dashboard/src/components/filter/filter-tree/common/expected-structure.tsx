import { Button, Collapse } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const structure = `
// row
{
  label: string;
  value: string;
  parent_value: string | null;
  description?: string;
  disabled?: boolean;
}
`;

export const ExpectedStructureForTreeSelect = () => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button variant="subtle" compact onClick={() => setOpened((o) => !o)}>
        {opened ? t('common.actions.close') : t('filter.widget.common.see_data_structure')}
      </Button>

      <Collapse in={opened}>
        <CodeHighlight language="typescript" withCopyButton={false} code={structure} />
      </Collapse>
    </>
  );
};
