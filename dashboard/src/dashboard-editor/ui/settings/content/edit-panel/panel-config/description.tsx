import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditDescription = observer(() => {
  const { t } = useTranslation();
  const { panel } = useEditPanelContext();

  return (
    <CustomRichTextEditor
      label={t('panel.panel_description')}
      value={panel.description}
      onChange={panel.setDescription}
      styles={{ root: { flexGrow: 1 } }}
    />
  );
});
