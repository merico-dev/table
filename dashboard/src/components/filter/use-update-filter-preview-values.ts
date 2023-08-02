import { useEffect } from 'react';
import { useEditContentModelContext } from '~/contexts';

export function useUpdateFilterPreviewValues(formValue: any) {
  const content = useEditContentModelContext();

  useEffect(() => {
    // this form is not a controlled component,
    // so we need to manually update the model
    content.filters.updatePreviewValues?.(formValue);
  }, [formValue]);
}
