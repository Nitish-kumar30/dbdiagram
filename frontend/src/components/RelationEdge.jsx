import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

export default function RelationEdge({id,sourceX,sourceY,targetX,targetY, sourcePosition,targetPosition,style = {},markerEnd,data,}){
  const [edgePath] = getBezierPath({sourceX,sourceY,sourcePosition,targetX,targetY,targetPosition,});

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {data?.source && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceX + 15}px,${sourceY}px)`,
              fontSize: 14,
              pointerEvents: 'none',
            }}
            className="nodrag nopan font-bold text-gray-600"
          >
            {data.source}
          </div>
        )}
        {data?.target && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${targetX - 15}px,${targetY}px)`,
              fontSize: 14,
              pointerEvents: 'none',
            }}
            className="nodrag nopan font-bold text-gray-600"
          >
            {data.target}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
