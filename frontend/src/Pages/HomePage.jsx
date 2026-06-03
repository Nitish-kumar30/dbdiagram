import  { useEffect } from "react";
import LeftEditor from "../components/LeftEditor";
import ReactFlowCanvas from "../components/ReactFlowCanvas";
import { parseDbml } from "../utils/dbmlParser";
import { useDiagramStore } from "../zustand-store/diagramStore";
import { api } from "../utils/api";

const HomePage = () => {
  const { code, setCode, setDiagramId, setTitle } = useDiagramStore();
  const parsedSchema = parseDbml(code);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/diagrams/latest");
        
        if (res.data) {
          setCode(res.data.schema || "");
          setDiagramId(res.data._id);
          setTitle(res.data.title || "Untitled project");
        }
      } catch (err) {
        console.error("No diagram found or error fetching");
      }
    };
    fetchLatest();
  }, [setCode, setDiagramId, setTitle]);

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
