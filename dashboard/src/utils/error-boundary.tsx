import React, { ReactElement, ReactNode } from 'react';
import { Box, Button, Text } from '@mantine/core';

type PropType = {
  children: React.ReactNode;
};
type StateType = {
  error: null | $TSFixMe;
};

export class ErrorBoundary extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: $TSFixMe) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      const retry = () => {
        this.setState({ error: null });
      };
      return (
        <Box>
          <Text size="xs">{this.state.error?.message}</Text>
          <Button variant="subtle" mx="auto" size="compact-xs" sx={{ display: 'block' }} onClick={retry}>
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export function errorBoundary(Component: $TSFixMe, options = { handleError: true }) {
  return (props: $TSFixMe) => {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
