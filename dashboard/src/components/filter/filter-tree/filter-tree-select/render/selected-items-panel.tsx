import { ActionIcon, Button, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { TreeItem } from 'performant-array-to-tree';
import { useTranslation } from 'react-i18next';

interface SelectedItemsPanelProps {
  selectedItems: TreeItem[];
  itemPaths: Map<string, string>;
  onRemoveItem: (value: string) => void;
  onClearAll: () => void;
  height: number;
}

/**
 * Extracts displayable text from a TreeItem label
 */
function getItemLabel(item: TreeItem): string {
  if (typeof item.label === 'string') {
    return item.label;
  }
  return item.filterBasis || String(item.value);
}

export const SelectedItemsPanel = ({
  selectedItems,
  itemPaths,
  onRemoveItem,
  onClearAll,
  height,
}: SelectedItemsPanelProps) => {
  const { t } = useTranslation();

  const hasItems = selectedItems && selectedItems.length > 0;

  return (
    <Stack
      gap={0}
      style={{
        height: `${height}px`,
        backgroundColor: '#fafafa',
        borderLeft: '1px solid #e9ecef',
      }}
    >
      {/* Header */}
      {hasItems && (
        <>
          <Group
            justify="space-between"
            align="center"
            bg="white"
            px="xs"
            py={1}
            style={{
              position: 'sticky',
              top: 0,
              borderBottom: '1px solid #e9ecef',
            }}
          >
            <Text size="xs" fw={500} c="#212529">
              {t('filter.widget.tree_select.selected_items')}
            </Text>
            <Button size="xs" variant="subtle" onClick={onClearAll}>
              {t('common.actions.clear')}
            </Button>
          </Group>

          <Divider />
        </>
      )}

      {/* Items List */}
      <Stack
        gap={4}
        p="xs"
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {!hasItems ? (
          <Text
            size="sm"
            c="dimmed"
            ta="center"
            pt="xl"
            style={{
              userSelect: 'none',
            }}
          >
            {t('filter.widget.tree_select.no_items_selected')}
          </Text>
        ) : (
          selectedItems.map((item) => {
            const path = itemPaths.get(item.value) || '';
            const label = getItemLabel(item);

            return (
              <Group
                key={item.value}
                gap="xs"
                p={6}
                wrap="nowrap"
                style={{
                  borderRadius: '4px',
                  transition: 'background-color 100ms ease',
                  cursor: 'default',
                  backgroundColor: '#fff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f3f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  {/* Item Label */}
                  <Text
                    size="sm"
                    fw={500}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Text>
                  {/* Hierarchical Path */}
                  <Tooltip label={path} disabled={path.length < 30}>
                    <Text
                      size="xs"
                      c="#868e96"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {path}
                    </Text>
                  </Tooltip>
                </Stack>

                {/* Delete Button */}
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={() => onRemoveItem(item.value)}
                  aria-label={`Remove ${label}`}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            );
          })
        )}
      </Stack>
    </Stack>
  );
};
