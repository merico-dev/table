import { Button } from '@mantine/core';
import { useDashboardThemeContext } from '~/contexts';
import { RenderSearchButtonProps } from '~/index';

export const SearchButton = ({ disabled, onSubmit }: RenderSearchButtonProps) => {
  const { renderSearchButton } = useDashboardThemeContext();
  if (renderSearchButton) {
    return renderSearchButton({ disabled, onSubmit });
  }
  return (
    <Button color="blue" size="sm" onClick={() => onSubmit()} disabled={disabled}>
      Search
    </Button>
  );
};
