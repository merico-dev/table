import { Spotlight } from '@mantine/spotlight';
import '@mantine/spotlight/styles.css';
import { IconSearch } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { SpotlightActions } from './spotlight-actions';

export const EditorSpotlight = observer(() => {
  const { t, i18n } = useTranslation();
  const model = useEditDashboardContext();

  const [query, setQuery] = useState('');
  const actionGroups = useMemo(() => {
    return model.editor.spotlightActionGroups.map((g) => {
      return {
        group: t(g.group),
        keywords: [g.group, t(g.group)],
        actions: g.actions.map((a) => {
          const keywords = [];
          if (a.title) {
            keywords.push(a.title.toLowerCase());
            keywords.push(t(a.title).toLowerCase());
          }
          if (a.group) {
            keywords.push(a.group.toLowerCase());
          }
          if (a.viz) {
            keywords.push(a.viz.displayGroup.toLowerCase());
            keywords.push(a.viz.displayName.toLowerCase());
          }
          if (a.iconKey) {
            keywords.push(a.iconKey);
          }
          return {
            ...a,
            keywords,
          };
        }),
      };
    });
  }, [model.editor.spotlightActionGroups, i18n.language]);

  const filteredGroups = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [actionGroups[0]];
    }
    return actionGroups
      .map((g) => {
        const groupMatch = g.keywords.some((k) => k.includes(q));
        if (groupMatch) {
          return g;
        }
        const actions = g.actions.filter((a) => a.keywords.some((k) => k.includes(q)));
        if (actions.length === 0) {
          return null;
        }
        return {
          ...g,
          actions,
        };
      })
      .filter((g) => !!g);
  }, [actionGroups, query]);

  return (
    <Spotlight.Root
      onQueryChange={setQuery}
      shortcut={['mod + P', 'mod + K']}
      radius="md"
      styles={{
        search: { border: 'none' },
      }}
    >
      <Spotlight.Search placeholder={t('spotlight.placeholder')} leftSection={<IconSearch size="1.2rem" />} />
      <Spotlight.ActionsList>
        <SpotlightActions groups={filteredGroups} query={query} />
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
});
