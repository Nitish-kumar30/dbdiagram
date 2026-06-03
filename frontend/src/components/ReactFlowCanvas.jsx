import React, { useEffect } from "react";
import ReactFlow, {Background,Controls,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import TableNode from "./TableNode";

import { schemaToFlow } from "../utils/schemaToFlow";

const nodeTypes = { tableNode: TableNode };
const edgeTypes = {};
function ReactFlowCanvas({ parsedSchema }) {
  // const initialEdges = [];
  // const [edges , setEdges ] = useState(initialEdges);
  // const [nodes , setNodes] = useState(initialEdges);
  const initialFlow = schemaToFlow(parsedSchema);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);

  useEffect(() => {
    const nextFlow = schemaToFlow(parsedSchema);

    setNodes(nextFlow.nodes);
    setEdges(nextFlow.edges);
  }, [parsedSchema, setNodes, setEdges]);

  return (
    <div>
      <div className=" h-[90vh] w-full ">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default ReactFlowCanvas;


