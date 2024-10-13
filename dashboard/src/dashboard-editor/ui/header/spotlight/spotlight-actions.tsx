import { Spotlight } from '@mantine/spotlight';
import { useTranslation } from 'react-i18next';
import { SpotlightActionComponent } from './spotlight-action-component';
import { CustomSpotlightActionData, CustomSpotlightActionGroupData } from '~/dashboard-editor/model/editor';

type Props = {
  groups: CustomSpotlightActionGroupData[];
  query: string;
};

export const SpotlightActions = ({ groups, query }: Props) => {
  const { t } = useTranslation();
  if (groups.length === 0) {
    return <Spotlight.Empty>{t('spotlight.not_found')}</Spotlight.Empty>;
  }

  return (
    <>
      {groups.map((g) => {
        return (
          <Spotlight.ActionsGroup key={g.group} label={g.group}>
            {g.actions.map((a) => (
              <Spotlight.Action key={a.id} onClick={a.onClick}>
                <SpotlightActionComponent action={a} query={query} />
              </Spotlight.Action>
            ))}
          </Spotlight.ActionsGroup>
        );
      })}
    </>
  );
};
