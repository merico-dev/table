import { Box, Button, Divider, Group, Modal, NumberInput, PasswordInput, SegmentedControl, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { showNotification, updateNotification } from "@mantine/notifications";
import React from "react";
import { PlaylistAdd } from "tabler-icons-react";
import { APICaller } from "../api-caller";
import { DataSourceType, IDataSourceConfig } from "../api-caller/datasource.typed";

interface IFormValues {
  type: DataSourceType;
  key: string;
  config: IDataSourceConfig;
}

function AddDataSourceForm({ postSubmit }: { postSubmit: () => void }) {
  const { control, handleSubmit, formState: { errors, isValidating, isValid } } = useForm<IFormValues>({
    defaultValues: {
      type: 'postgresql',
      key: '',
      config: {
        host: '',
        port: 5432,
        username: '',
        password: '',
        database: '',
      }
    }
  });

  const addDataSource = async ({ type, key, config }: IFormValues) => {
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Adding data source...',
      loading: true,
    })
    const result = await APICaller.datasource.create(type, key, config);
    if (!result) {
      updateNotification({
        id: 'for-creating',
        title: 'Failed',
        message: 'Test connection failed with given info',
        color: 'red'
      })
      return;
    }

    updateNotification({
      id: 'for-creating',
      title: 'Successful',
      message: 'Data source is added',
      color: 'green'
    })
    postSubmit()
  }

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(addDataSource)}>
        <Controller
          name='type'
          control={control}
          render={(({ field }) => (
            <SegmentedControl
              fullWidth
              mb="md"
              data={[
                { label: 'PostgreSQL', value: 'postgresql' },
                { label: 'MySQL', value: 'mysql' },
                { label: 'HTTP', value: 'http', disabled: true },
              ]}
              {...field}
            />
          ))}
        />

        <Controller
          name='key'
          control={control}
          render={(({ field }) => (
            <TextInput
              mb="md"
              required
              label="Name"
              placeholder="A unique name"
              {...field}
            />
          ))}
        />

        <Divider label="Connection Info" labelPosition="center"/>

        <Group grow>
          <Controller
            name='config.host'
            control={control}
            render={(({ field }) => (
              <TextInput
                mb="md"
                required
                label="Host"
                sx={{ flexGrow: 1 }}
                {...field}
              />
            ))}
          />
          <Controller
            name='config.port'
            control={control}
            render={(({ field }) => (
              <NumberInput
                mb="md"
                required
                label="Port"
                hideControls
                sx={{ width: '8em' }}
                {...field}
              />
            ))}
          />
        </Group>

        <Controller
          name='config.username'
          control={control}
          render={(({ field }) => (
            <TextInput
              mb="md"
              required
              label="Username"
              {...field}
            />
          ))}
        />
        <Controller
          name='config.password'
          control={control}
          render={(({ field }) => (
            <PasswordInput
              mb="md"
              required
              label="Password"
              {...field}
            />
          ))}
        />
        <Controller
          name='config.database'
          control={control}
          render={(({ field }) => (
            <TextInput
              mb="md"
              required
              label="Database"
              {...field}
            />
          ))}
        />

        <Group position="right" mt="md">
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Box>
  )
}

interface IAddDataSource {
  onSuccess: () => void;
}

export function AddDataSource({ onSuccess }: IAddDataSource) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    onSuccess()
    close()
  }

  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a data source"
        trapFocus
        onDragStart={e => { e.stopPropagation() }}
      >
        <AddDataSourceForm postSubmit={postSubmit} />
      </Modal>
      <Button size="sm" onClick={open} leftIcon={<PlaylistAdd size={20} />}>Add a Data Source</Button>
    </>
  )
}