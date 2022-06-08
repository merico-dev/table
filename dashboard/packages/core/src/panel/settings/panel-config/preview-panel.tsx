import { Container, Group, Text } from "@mantine/core";
import React from "react";
import { PanelContext } from "../../../contexts";
import { ErrorBoundary } from "../../error-boundary";
import { DescriptionPopover } from "../../panel-description";

export function PreviewPanel() {
  const { title, description } = React.useContext(PanelContext);
  return (
    <ErrorBoundary>
      <Container mt="xl" p="5px" sx={{
        width: '600px',
        height: '450px',
        background: 'transparent',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)',
      }}>
        <Group position='apart' noWrap sx={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
          <Group>
            <DescriptionPopover position="bottom" trigger="hover" />
          </Group>
          <Group grow position="center">
            <Text lineClamp={1} weight="bold">{title}</Text>
          </Group>
          <Group
            position="right"
            spacing={0}
            sx={{ height: '28px' }}
          />
        </Group>
      </Container>
    </ErrorBoundary>
  )
}