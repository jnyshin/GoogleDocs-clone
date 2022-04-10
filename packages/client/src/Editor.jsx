import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import API from "./api";
const TOOLBAR = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image", "video"],
  ["clean"],
  ["code-block"],
];

const FORMAT = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "image",
  "video",
  "code-block",
];
function App({ id }) {
  const [quill, setQuill] = useState();
  const [id, setId] = useState();
  const [docId, setDocId] = useState();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    setId(params.id);
    setDocId(params.docId);
  }, []);

  useEffect(() => {
    if (quill && !listening) {
      const evtSource = new EventSource(
        `http://${DOMAIN_NAME}/connect/${id}/${docId}`
      );
      evtSource.onopen = function () {
        console.log("connection establised");
        setListening(true);
      };

      evtSource.onmessage = function (event) {
        console.log("message from server event push");
        const dataFromServer = JSON.parse(event.data);
        const { action, data } = dataFromServer;
        console.log(data);
        if (action === "set") {
          quill.setContents(data);
          quill.enable();
        } else {
          quill.updateContents(data);
        }
      };
      evtSource.onerror = function (event) {
        console.log("Error occured");
      };
    }
  }, [quill]);

  // update
  useEffect(() => {
    if (!quill) return;
    const update = (delta, oldDelta, source) => {
      if (source === "user") {
        const contents = quill.getContents();
        console.log(delta);
        API.post(`op/${id}`, delta);
      }
    };
    quill.on("text-change", update);
  }, [quill]);

  const quillRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      modules: { toolbar: TOOLBAR },
      formats: FORMAT,
      theme: "snow",
    });
    q.disable();
    q.setText("loading..");
    setQuill(q);
  }, []);

  return (
    <div className="App">
      <div className="header">
        <img src={require("./docs.png")} alt="homepage" width="40px" />
        <div className="header-options">
          <input
            type="text"
            onChange={onTitleChange}
            placeholder="Untitled"
            disabled
          />
          <button onClick={() => console.log(listening)}>Test</button>
          <div className="header-btns">
            <a href="/">File</a>
            <a href="/">Edit</a>
            <a href="/">View</a>
            <a href="/">Help</a>
          </div>
        </div>
      </div>
      <div ref={quillRef} style={{ height: "1000px" }}></div>
    </div>
  );
}

export default App;