import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

export const MDInputQuestion = () => {
  const [value, setValue] = useState("**Hello world!!!**");

  return (
    <div>
      <MDEditor value={value} onChange={() => setValue} />
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
};
