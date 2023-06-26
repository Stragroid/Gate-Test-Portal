import { useState } from "react";
import "./style.css";

export default function Collapsible(props) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <button className="collapsibleHeader" onClick={toggle}>
        {open ? "▼ " : "► "}
        Question {props.index + 1}
      </button>
      <div
        className={open ? "collapsibleChildren" : "collapsibleChildren--hidden"}
      >
        {props.children}
      </div>
    </>
  );
}
