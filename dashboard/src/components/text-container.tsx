import { Box, Tooltip } from '@mantine/core';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

interface ITextContainer {
  children: ReactNode;
}
export function TextContainer({ children }: ITextContainer) {
  const newStyle: Record<string, any> = {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as const;

  const [visible, setVisible] = useState();
  const containerRef = useRef(null);
  const onresize = () =>
    setVisible(
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      containerRef.current.clientWidth !== containerRef.current.scrollWidth,
    );
  useLayoutEffect(() => {
    onresize();
  });

  return (
    <Tooltip label={children} withinPortal disabled={!visible}>
      <Box onMouseEnter={onresize} ref={containerRef} style={newStyle}>
        {children}
      </Box>
    </Tooltip>
  );
}
