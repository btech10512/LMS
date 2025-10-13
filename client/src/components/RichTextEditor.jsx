import React, { useRef, useEffect } from "react";

const RichTextEditor = ({ input, setInput }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = input.description || "";
    }
  }, [input.description]);

  const handleInput = () => {
    const html = editorRef.current.innerHTML;
    setInput({ ...input, description: html });
  };

  return (
    <div>
      <div
        ref={editorRef}
        onInput={handleInput}
        contentEditable
        className="border rounded-md p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your course description here..."
        style={{ backgroundColor: "white" }}
      />
    </div>
  );
};

export default RichTextEditor;
