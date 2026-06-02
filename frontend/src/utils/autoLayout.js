import dagre from 'dagre';

const NODE_WIDTH = 260;
const HEADER_HEIGHT = 42;
const ROW_HEIGHT = 32;

function getNodeHeight(columnCount){
  return HEADER_HEIGHT + Math.max(columnCount, 1) * ROW_HEIGHT;
}

function setGraphNode(graph, node) {
  graph.setNode(node.id,{
    width: NODE_WIDTH,
    height: getNodeHeight(node.data.columns.length),
  });
}

function positionNode(graph, node) {
  const layout = graph.node(node.id);
  const height = getNodeHeight(node.data.columns.length);

  return {
    ...node,
    position: {
      x: layout.x - NODE_WIDTH / 2,
      y: layout.y - height / 2,
    },
  };
}

export function getLayoutedElements(nodes, edges){


  const graph = new dagre.graphlib.Graph();
  
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({rankdir:'LR', nodesep: 90, ranksep: 150});

  nodes.forEach((node) => setGraphNode(graph, node));

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => positionNode(graph, node));
}
