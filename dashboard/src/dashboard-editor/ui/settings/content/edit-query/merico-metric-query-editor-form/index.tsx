import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const MericoMetricQueryEditorForm = observer(({ queryModel }: Props) => {
  return <div>MericoMetricQueryEditorForm</div>;
});
