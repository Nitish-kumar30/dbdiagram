import React from "react";
import { Input  } from '@heroui/react';
import { Save  , LogIn , Share2} from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDiagramStore } from "../zustand-store/diagramStore";
import { api } from "../utils/api";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const { title, setTitle, code, diagramId, setDiagramId } = useDiagramStore();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSaving(true);
    try {
      if (diagramId) {
        await api.put(`/diagrams/${diagramId}`, { title, schema: code });
        alert("Saved!");
      } else {
        const res = await api.post("/diagrams", { title, schema: code });
        setDiagramId(res.data._id);
        alert("Saved!");
      }
    } catch (err) {
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!user) {
      alert("Please sign in to share.");
      return;
    }
    if (!diagramId) {
      alert("Please save the diagram first!");
      return;
    }
    try {
      const res = await api.post(`/diagrams/${diagramId}/share`);
      const shareUrl = `${window.location.origin}/share/${res.data.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Copied Public URL to clipboard:\n${shareUrl}`);
    } catch (err) {
      alert("Error sharing");
    }
  };

  const logout =()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-16 bg-gray-800 px-4 flex items-center text-white">
      {/* // left part of navbar  */}
      <div className="w-3/5 font-medium flex gap-x-10 items-center">


        <div className="bg-blue-400 rounded-5px text-white  text-xl px-5 py-1 rounded-md" >Db Diagram</div>


        <div className="flex  items-center"> 
            <Input aria-label="Name" value={title} onChange={(e) => setTitle(e.target.value)} className="w-20px bg-gray-600 text-white " placeholder="Untitled project" />
            <Save className="cursor-pointer" onClick={handleSave} />
        </div>
       
       
      </div>


      {/* // right part of navbar */}
      <div className="w-2/5 font-medium flex items-center gap-x-10 justify-end "> 


      <div className="bg-blue-400 text-white w-15px flex items-center px-5 py-1 rounded-md cursor-pointer" onClick={handleSave}>
            <Save/> {saving ? "Saving..." : "Save"}
          </div>


          <div className="bg-blue-400 text-white w-15px flex items-center px-5 py-1 rounded-md cursor-pointer" onClick={handleShare}>
            <Share2/> share
          </div>

          {user && <div className="bg-gray-600 text-white w-15px flex items-center px-5 py-1 rounded-md ">
            {user.name}

          </div>}
          {!user && <NavLink to="/login" className={({isActive}) => `bg-gray-600 text-white w-15px flex items-center px-5 py-1 rounded-md ${isActive ? "underline" : ""}`}>
            Sign in  <LogIn />
          </NavLink>}

          {!user && <NavLink to="/register" className={({isActive}) => `bg-gray-600 text-white w-15px flex items-center px-5 py-1 rounded-md ${isActive ? "underline" : ""}`}>
             Register
          </NavLink>}

          {user && <button onClick={logout} className="bg-gray-600 text-white w-15px flex items-center px-5 py-1 rounded-md ">
             Sign out
          </button>}

      
      </div>
    </div>
  );
};

export default Navbar;














