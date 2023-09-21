import { Button, ButtonProps } from '@mantine/core';
import { useDashboardThemeContext } from '~/contexts';

export const SearchButton = ({ disabled }: { disabled: boolean }) => {
  const { searchButtonProps } = useDashboardThemeContext();
  const { children = 'Search', type, ...rest } = searchButtonProps;
  return (
    <Button color="blue" size="sm" type="submit" {...rest} disabled={disabled || rest.disabled}>
      {children}
    </Button>
  );
};
