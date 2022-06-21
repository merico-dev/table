import React from "react";
import { Text } from '@mantine/core'

type PropType = {
  children: React.ReactNode;
}
type StateType = {
  error: null | any;
}

export class ErrorBoundary extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: any) {
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return <Text size="xs">{this.state.error?.message}</Text>;
    }

    return this.props.children;
  }
}
