import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlowCanvas from "../components/ReactFlowCanvas";
import LeftEditor from "../components/LeftEditor";
import { parseDbml } from "../utils/dbmlParser";
import { api } from "../utils/api";

const SharePage = () => {
  const { token } = useParams();
  const [schema, setSchema] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiagram = async () => {
      try {
        const res = await api.get(`/diagrams/share/${token}`);
        setSchema(res.data.schema || "");
        setTitle(res.data.title || "Shared Diagram");
      } catch (err) {
        setError("Diagram not found or is no longer public.");
      }
    };
    fetchDiagram();
  }, [token]);

  const parsedSchema = parseDbml(schema);

  if (error) {
    return <div className="p-10 text-red-500 text-center text-xl">{error}</div>;
  }

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="w-full min-h-16 bg-gray-800 px-4 flex items-center text-white">
        <div className="bg-blue-400 rounded-5px text-white text-xl px-5 py-1 rounded-md">
          {title} (Read Only)
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="w-1/2 h-full">
          <LeftEditor code={schema} onChange={() => {}} readOnly={true} />
        </div>
        <div className="w-1/2 h-full relative bg-white">
          <ReactFlowCanvas parsedSchema={parsedSchema} />
        </div>
      </div>
    </div>
  );
};

export default SharePage;
