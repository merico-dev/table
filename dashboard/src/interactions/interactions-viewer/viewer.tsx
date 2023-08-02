import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useRenderContentModelContext } from '~/contexts';
import { makeNodesAndEdges } from './data';
import { InteractionNode } from './node-with-interactions';
import './viewer.css';

const nodeTypes = {
  interaction: InteractionNode,
};

export const InteractionsViewer = observer(() => {
  const model = useRenderContentModelContext();
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
      nodeTypes={nodeTypes}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
});
