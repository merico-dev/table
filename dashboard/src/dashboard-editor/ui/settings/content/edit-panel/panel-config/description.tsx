import { observer } from 'mobx-react-lite';
import { usePanelContext } from '~/contexts/panel-context';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';

export const EditDescription = observer(() => {
  const { panel } = usePanelContext();

  return (
    <CustomRichTextEditor
      label="Description"
      value={panel.description}
      onChange={panel.setDescription}
      styles={{ root: { flexGrow: 1 } }}
    />
  );
});
