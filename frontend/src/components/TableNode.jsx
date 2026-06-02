import React from "react";
import { Handle, Position } from "reactflow";
// Table posts {
//   id integer [primary key]
//   title varchar
//   body text [note: 'Content of the post']
//   user_id integer [not null]
//   status varchar
//   created_at timestamp
// }

// {
//   id: "users",
//   type: "table",
//   position: { x: 100, y: 150 },
//   data: { name: "users", columns: [ /* column objects */ ] }
// }
// {
//   name: "users",
//   columns: [
//     { name: "id", type: "int", pk: true, fk: false, notNull: true, unique: true },
//     { name: "email", type: "varchar(255)", pk: false, fk: false, notNull: true, unique: true },
//     { name: "profile id", type: "int", pk: false, fk: true, notNull: false, unique: false }
//   ]
// }

const TableNode = ({ data }) => {
  return (
    <div className="">
      <div className="bg-blue-400  px-3 font-bold text-white ">{data.name}</div>
      {data.columns.map((col) => (
        <ColumnRow key={col.name} column={col} />
      ))}
    </div>
  );
};
function ColumnRow({ column }) {
  return (
    <div className="bg-gray-300 ">
      <Handle
        className="h-1.75 w-1.75 bg-blue-400"
        id={`${sanitize(column.name)}-in`}
        position={Position.Left}
        type="target"
      />
      <div className="flex items-center justify-between px-3 py-1" >

          <span className="mx-2" >{column.name}</span>
      <span className="mx-2">   
        {column.notNull &&  <span className="text-purple-600" >NN</span>}
        {column.unique &&  <span className="text-purple-600">U</span>}
        {column.type}
      </span>

      </div>
      

      <Handle
        className="h-1.75 w-1.75 bg-blue-400"
        id={`${sanitize(column.name)}-out`}
        position={Position.Right}
        type="source"
      />
    </div>
  );
}

export default TableNode;

function sanitize(name = "") {
  return String(name)
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");
}
