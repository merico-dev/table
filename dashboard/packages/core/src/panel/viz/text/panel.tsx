import { ActionIcon, Button, Code, Group, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useForm, formList } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import { DeviceFloppy, Trash } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { MantineFontWeightSlider } from "../../settings/common/mantine-font-weight";

interface IParagraph {
  align: 'center' | 'left' | 'right';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight: string | number;
  color: string;
  template: string;
}

const sampleParagraphs: IParagraph[] = [
  {
    align: "center",
    size: "xl",
    weight: "bold",
    color: "black",
    template: "Time: ${new Date().toISOString()}"
  },
  {
    align: "center",
    size: "md",
    weight: "bold",
    color: "red",
    template: "Platform: ${navigator.userAgentData.platform}."
  }
];

export function VizTextPanel({ conf, setConf }: IVizPanelProps) {
  const form = useForm({
    initialValues: {
      paragraphs: formList<IParagraph>(conf.paragraphs ?? sampleParagraphs),
    },
  });

  const addParagraph = () => form.addListItem('paragraphs', { ...sampleParagraphs[0], template: randomId() });

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={form.onSubmit(setConf)}>
        {form.values.paragraphs.length === 0 && (
          <Text color="dimmed" align="center">
            Empty
          </Text>
        )}

        <Group position="apart" mb='xs' sx={{ ' + .mantine-Group-root': { marginTop: 0 } }}>
          <Text>Paragraphs</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        {form.values.paragraphs.map((item, index) => (
          <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
            <TextInput
              placeholder="Time: ${new Date().toISOString()}"
              label="Content Template"
              required
              sx={{ flex: 1 }}
              {...form.getListInputProps('paragraphs', index, 'template')}
            />
            <Group direction="column" grow>
              <Text>Color</Text>
              <MantineColorSelector {...form.getListInputProps('paragraphs', index, 'color')} />
            </Group>
            <Group direction="column" grow>
              <TextInput
                label="Font Size"
                placeholder="10px, 1em, 1rem, 100%..."
                sx={{ flex: 1 }}
                {...form.getListInputProps('paragraphs', index, 'size')}
              />
            </Group>
            <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
              <MantineFontWeightSlider label="Font Weight" {...form.getListInputProps('paragraphs', index, 'weight')} />
            </Group>
            <ActionIcon
              color="red"
              variant="hover"
              onClick={() => form.removeListItem('paragraphs', index)}
              sx={{ position: 'absolute', top: 15, right: 5 }}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        ))}
        <Group position="center" mt="md">
          <Button onClick={addParagraph}>
            Add a Paragraph
          </Button>
        </Group>

        <Text size="sm" weight={500} mt="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>{JSON.stringify(form.values, null, 2)}</Prism>
      </form>
    </Group>
  )
}