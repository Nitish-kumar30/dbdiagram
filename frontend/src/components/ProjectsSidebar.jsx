import React from "react";
import { X } from "lucide-react";

const ProjectsSidebar = ({ visible, onClose, projects, onSelectProject }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white z-50 shadow-xl border-r border-gray-200 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg text-black">My Projects</h2>
        <button
          onClick={onClose}
          aria-label="Close projects sidebar"
          title="Close"
          className="text-gray-500 font-bold text-2xl hover:text-black leading-none"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {projects.length === 0 ? (
          <div className="text-gray-500 text-sm p-2">No projects found.</div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              onClick={() => onSelectProject(project)}
              className="p-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer text-black"
            >
              <div className="font-semibold truncate">
                {project.title || "Untitled Project"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(project.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsSidebar;
