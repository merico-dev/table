import { observer } from 'mobx-react-lite';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditDescription = observer(() => {
  const { panel } = useEditPanelContext();

  return (
    <CustomRichTextEditor
      label="Description"
      value={panel.description}
      onChange={panel.setDescription}
      styles={{ root: { flexGrow: 1 } }}
    />
  );
});
