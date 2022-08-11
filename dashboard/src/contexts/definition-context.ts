import React from 'react';

export interface IDefinitionContext {}

const initialContext = {};

export const DefinitionContext = React.createContext<IDefinitionContext>(initialContext);
