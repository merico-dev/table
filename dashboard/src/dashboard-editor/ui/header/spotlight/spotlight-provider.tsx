import { Spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode, useCallback, useMemo } from 'react';
import { useEditDashboardContext } from '~/contexts';
import { SpotlightActionComponent } from './spotlight-action-component';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';

export const SpotlightProvider = observer(({ children }: { children: ReactNode }) => {
  const { t, i18n } = useTranslation();
  const model = useEditDashboardContext();

  const actions = useMemo(() => {
    return model.editor.spotlightActions.map((a) => {
      const group = a.group;
      return {
        ...a,
        group: group ? t(group) : undefined,
        keywords: [a.title, t(a.title)],
      };
    });
  }, [model.editor.spotlightActions, i18n.language]);

  const [searching, { set: setSearching }] = useBoolean(false);

  const handleQueryChange = useCallback((q: string) => {
    setSearching(!!q);
  }, []);
  return (
    <Spotlight
      actions={actions}
      actionComponent={SpotlightActionComponent}
      shortcut={['mod + P', 'mod + K']}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder={t('spotlight.placeholder')}
      nothingFoundMessage={t('spotlight.not_found')}
      limit={searching ? 20 : 5}
      onQueryChange={handleQueryChange}
    >
      {children}
    </Spotlight>
  );
});
