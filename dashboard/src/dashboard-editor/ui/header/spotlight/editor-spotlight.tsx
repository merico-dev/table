import { Spotlight } from '@mantine/spotlight';
import '@mantine/spotlight/styles.css';
import { IconSearch } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { SpotlightActionComponent } from './spotlight-action-component';

export const EditorSpotlight = observer(() => {
  const { t, i18n } = useTranslation();
  const model = useEditDashboardContext();

  const [query, setQuery] = useState('');
  const actions = useMemo(() => {
    return model.editor.spotlightActions.map((a) => {
      const group = a.group;
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
        group: group ? t(group) : undefined,
        keywords,
      };
    });
  }, [model.editor.spotlightActions, i18n.language]);

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return actions.slice(0, 5);
    }
    return actions.filter((a) => a.keywords.some((k) => k.includes(q))).slice(0, 20);
  }, [actions, query]);

  return (
    <Spotlight.Root onQueryChange={setQuery} shortcut={['mod + P', 'mod + K']}>
      <Spotlight.Search placeholder={t('spotlight.placeholder')} leftSection={<IconSearch size="1.2rem" />} />
      <Spotlight.ActionsList>
        {items.length > 0 &&
          items.map((a) => (
            <Spotlight.Action key={a.id} label={t(a.title!)} {...a}>
              <SpotlightActionComponent action={a} onClick={a.onClick} query={query} />
            </Spotlight.Action>
          ))}
        {items.length === 0 && <Spotlight.Empty>{t('spotlight.not_found')}</Spotlight.Empty>}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
});
