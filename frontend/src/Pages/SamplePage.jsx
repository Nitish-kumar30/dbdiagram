import React from 'react'
import TableNode from '../components/TableNode'

const SamplePage = () => {
  const data = {
    
  id: "users",
  type: "table",
  position: { x: 100, y: 150 },
  data: { name: "users", columns: [ 
              { name: "id", type: "int", pk: true, fk: false, notNull: true, unique: true },
              { name: "email", type: "varchar(255)", pk: false, fk: false, notNull: true, unique: true },
              { name: "profile id", type: "int", pk: false, fk: true, notNull: false, unique: false }
   ] }



  }
  return (
    <div>
      hi this is testing page .
      <TableNode data={data} />

      
    </div>
  )
}

export default SamplePage

