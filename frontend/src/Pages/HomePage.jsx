import React, { useState } from "react";
import LeftEditor from "../components/LeftEditor";
import ReactFlowCanvas from "../components/ReactFlowCanvas";
import { parseDbml } from "../utils/dbmlParser";

const HomePage = () => {
  const [code, setCode] = useState("paste ur table code here ");
  const parsedSchema = parseDbml(code);

  return (
    <div className="flex">
      <div className="w-1/2 h-[100vh] ">
        <LeftEditor code={code} onChange={setCode} />
      </div>
      <div className="w-1/2 h-[100vh] ">
        <ReactFlowCanvas parsedSchema={parsedSchema} />
      </div>
    </div>
  );
};

export default HomePage;
