import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useRenderContentModelContext } from '~/contexts';
import { IVizDashboardStateConf } from '../type';
import { StateItem } from './item/state-item';

type Props = {
  conf: IVizDashboardStateConf;
};
export const StateItems = observer(({ conf }: Props) => {
  const model = useRenderContentModelContext();
  const state = model.dashboardState;
  const { all, keys } = conf;
  if (all) {
    return (
      <>
        {Object.entries(state.context).map(([k, s]) => (
          <StateItem key={k} item={s} />
        ))}
        {Object.entries(state.filters).map(([k, s]) => (
          <StateItem key={k} item={s} />
        ))}
      </>
    );
  }

  return (
    <>
      {keys.map((k) => {
        const item = _.get(state, k);
        if (!item) {
          return null;
        }
        return <StateItem key={k} item={item} />;
      })}
    </>
  );
});
