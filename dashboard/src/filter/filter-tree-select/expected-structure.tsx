import { Button, Collapse } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useState } from 'react';

const structure = `
// row
{
  label: string;
  value: string;
  parent_value: string;
  description?: string;
}
`;

export const ExpectedStructureForTreeSelect = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button variant="subtle" compact onClick={() => setOpened((o) => !o)}>
        {opened ? 'Close' : 'Click to see expected data structure'}
      </Button>

      <Collapse in={opened}>
        <Prism language="typescript" noCopy colorScheme="dark">
          {structure}
        </Prism>
      </Collapse>
    </>
  );
};
