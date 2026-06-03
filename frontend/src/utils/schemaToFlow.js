import { MarkerType } from 'reactflow';
import { getLayoutedElements } from './autoLayout';


function getRelation(relation) {
  if (relation === 'many-to-one') 
    return {source: '*', target: '1'};

  if (relation === 'one-to-many') 
    return {source: '1' ,target: '*'};

  return {source: '1', target: '1'};
}


function buildNode(table){
  return{
    id: table.name,
    type:'tableNode',
    position: {x:0,  y:0},
    data:{
      name:table.name,
      columns:table.columns,
    },
  };
}

function buildEdge(ref, index){
  const edgeId = `${ref.fromTable}.${ref.fromCol}-${ref.toTable}.${ref.toCol}-${index}`;

  return{
    id: edgeId,
    source: ref.fromTable,
    target: ref.toTable,
    type: 'relation',
    
    animated: true,
    sourceHandle: `${sanitize(ref.fromCol)}-out`,
    targetHandle: `${sanitize(ref.toCol)}-in`,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#4a9eff',
    },
    data:{
      ...getRelation(ref.relation),
      name: ref.name,
      relation: ref.relation,
    },
  };
}

export function schemaToFlow(parsedSchema){
  const tables = parsedSchema?.tables  ||[];
  const refs = parsedSchema?.refs  ||[];
  const tableNames = new Set(tables.map((t) => t.name));

  const nodes = tables.map(buildNode);

  const edges = refs.filter((r) => tableNames.has(r.fromTable) && tableNames.has(r.toTable))
                  .map((r, i) => buildEdge(r, i));

  return {nodes: getLayoutedElements(nodes, edges), edges};
}









// Sanitize column names for use in handle ids (no spaces or special chars)
function sanitize(name = '') {
  return String(name).trim().replace(/\s+/g, '_').replace(/[^\w-]/g, '');
}