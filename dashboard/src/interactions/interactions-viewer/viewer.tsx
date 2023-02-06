import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import ReactFlow, { Background, Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { useModelContext } from '~/contexts';
import { makeNodesAndEdges } from './data';

export const InteractionsViewer = observer(() => {
  const model = useModelContext();
  const { edges, nodes } = makeNodesAndEdges(model);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={_.noop}
      onEdgesChange={_.noop}
      onConnect={_.noop}
      className="interactions-viewer"
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
});
