import { Container, Group, Text, Tooltip } from "@mantine/core";
import React from "react";
import { InfoCircle } from "tabler-icons-react";
import { PanelContext } from "../../../contexts";
import { ErrorBoundary } from "../../error-boundary";

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
            {description && (
              <Tooltip label={description} withArrow>
                <InfoCircle size={12} style={{ verticalAlign: 'baseline', cursor: 'pointer' }} />
              </Tooltip>
            )}
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