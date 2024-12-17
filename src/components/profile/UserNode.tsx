import { Handle, Position } from '@xyflow/react';
import Avvvatars from 'avvvatars-react';

// Attemp to render userNode

export default function UserNode({ data = { _id: 'asdfasd ' } }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <Avvvatars value={data._id} />
        <h1>{data._id}</h1>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
