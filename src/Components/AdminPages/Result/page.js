import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import "./style.css";
import { CSVLink } from "react-csv";

export default function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [csvData, setCsvData] = useState([
    ["Sl. No.", "Username", "Email", "Attendance", "Marks"],
  ]);

  useEffect(() => {
    getDocs(query(collection(db, "students"))).then((querySnapshot) => {
      let tempStuds = [];
      let tempCsvData = csvData;
      querySnapshot.forEach((doc) => {
        tempStuds.push(doc.data());
      });
      getDocs(query(collection(db, "test"))).then((querySnapshot) => {
        let tempQuestions = [];
        querySnapshot.forEach((doc) => {
          tempQuestions = doc.data().questions;
        });
        tempQuestions = Object.values(tempQuestions);
        for (let i = 1; i <= tempQuestions.length; i++) {
          tempCsvData[0].push(`q${i}`);
        }
        tempStuds.forEach((student, index) => {
          let marks = 0;
          if (student.attended) {
            let answers = Object.values(student.answers);
            for (let i = 0; i < answers.length; i++) {
              if (answers[i].answer === "") continue;
              if (tempQuestions[i].questionType === "somcq") {
                if ((answers[i].answer).toLowerCase() === (tempQuestions[i].a).toLowerCase()) {
                  marks += tempQuestions[i].marksOnCorrect;
                } else {
                  marks += tempQuestions[i].marksOnIncorrect;
                }
              } else if (tempQuestions[i].questionType === "momcq") {
                if (
                  Array.from(answers[i].answer).sort().toString().toLowerCase() ===
                  Array.from(tempQuestions[i].a).sort().toString().toLowerCase()
                ) {
                  marks += tempQuestions[i].marksOnCorrect;
                } else {
                  marks += tempQuestions[i].marksOnIncorrect;
                }
              } else {
                if (
                  parseFloat(answers[i].answer) ===
                  parseFloat(tempQuestions[i].a)
                ) {
                  marks += tempQuestions[i].marksOnCorrect;
                } else {
                  marks += tempQuestions[i].marksOnIncorrect;
                }
              }
            }
          }
          student.marks = marks;
          let tempCsvArray = [
            index + 1,
            student.username,
            student.email,
            student.attended ? "YES" : "NO",
            student.marks,
          ];
          Object.values(student.answers).forEach((answer) => {
            tempCsvArray.push(answer.answer);
          });
          tempCsvData.push(tempCsvArray);
        });
        tempStuds.sort((a, b) => {
          return b.marks - a.marks;
        });
        setCsvData(tempCsvData);
        setStudents(tempStuds);
      });
    });
  }, []);
  return (
    <>
      {students.length > 0 ? (
        <>
          <table>
            <tbody>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                {/* <th>Email</th> */}
                <th>Attendance</th>
                <th>Marks</th>
              </tr>
              {students.map((student, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.username}</td>
                    {/* <td>{student.email}</td> */}
                    <td style={{ color: student.attended ? "green" : "red" }}>
                      {student.attended ? "YES" : "NO"}
                    </td>
                    <td>{student.marks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="downloadBtns">
            <button className="downloadBtn">
              <CSVLink className="downloadBtnText" data={csvData}>
                Download Student Answer
              </CSVLink>
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
