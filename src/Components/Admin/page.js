import "./style.css";
import { useState } from "react";
import QuestionEditor from "../QuestionEditor/page";
import StudentsSection from "../StudentsSection/page";

export default function Admin() {
  const [currentSection, setCurrentSection] = useState(1);
  return (
    <>
      <div className="adminMain">
        <div className="adminLeft">
          <span
            onClick={() => {
              setCurrentSection(1);
            }}
          >
            Set Questions
          </span>
          <span
            onClick={() => {
              setCurrentSection(2);
            }}
          >
            Students Section
          </span>
        </div>
        <div className="adminRight">
          {currentSection === 1 ? <QuestionEditor /> : <StudentsSection />}
        </div>
      </div>
    </>
  );
}
