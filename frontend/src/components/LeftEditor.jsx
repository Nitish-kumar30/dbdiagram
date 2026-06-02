import React from "react";
import Editor from "@monaco-editor/react";

const LeftEditor = ({ code, onChange }) => {
  return (
    <div className="editor-box h-full w-full">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="dbml"
        theme="vs-dark"
        value={code}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={{ automaticLayout: true }}
      />
    </div>
  );
};

export default LeftEditor;
