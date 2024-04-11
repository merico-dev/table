import { Button, Collapse } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const structure = `
// row
{
  label: string;
  value: string;
  description?: string; // optional
}
`;

export const ExpectedStructureForSelect = () => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button variant="subtle" compact onClick={() => setOpened((o) => !o)}>
        {opened ? t('common.actions.close') : t('filter.widget.common.see_data_structure')}
      </Button>

      <Collapse in={opened}>
        <Prism language="typescript" noCopy colorScheme="dark">
          {structure}
        </Prism>
      </Collapse>
    </>
  );
};
