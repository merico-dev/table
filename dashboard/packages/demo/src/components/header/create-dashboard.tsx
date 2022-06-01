import { ActionIcon, Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import React from "react";
import { DashboardAPI } from "../../api-caller/dashboard";

function CreateDashboardForm({ postSubmit }: { postSubmit: () => void }) {
  const form = useForm({
    initialValues: {
      name: '',
    }
  });

  const createDashboard = async ({ name }: { name: string }) => {
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Creating dashboard...',
      loading: true,
    })
    const { id } = await DashboardAPI.create(name);
    updateNotification({
      id: 'for-creating',
      title: 'Successful',
      message: 'A new dashboard is created',
      color: 'green'
    })
    postSubmit()
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit(createDashboard)}>
        <TextInput
          required
          label="Name"
          placeholder="Name the dashboard"
          {...form.getInputProps('name')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Confirm</Button>
        </Group>
      </form>
    </Box>
  )
}

interface ICreateDashboard {
}

export function CreateDashboard({ }: ICreateDashboard) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create a Dashboard"
        trapFocus
        onDragStart={e => { e.stopPropagation() }}
      >
        <CreateDashboardForm postSubmit={close} />
      </Modal>
      <Button color="blue" onClick={open}>Create</Button>
    </>
  )
}