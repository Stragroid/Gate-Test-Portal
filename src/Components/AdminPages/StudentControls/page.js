import { db, auth, storage } from "../../../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
  Timestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";

export default function StudentControls() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    getDocs(query(collection(db, "students"))).then((querySnapshot) => {
      let tempStuds = [];
      querySnapshot.forEach((doc) => {
        tempStuds.push(doc.data());
      });
      setStudents(tempStuds);
    });
  }, []);

  function addStudent() {
    let tempStuds = [...students];
    tempStuds.push({
      username: studentName,
      email: studentEmail,
      attended: false,
      answers: null,
    });
    setStudents(tempStuds);
    setDoc(doc(db, "students", studentEmail), {
      username: studentName,
      email: studentEmail,
      attended: false,
      answers: null,
    })
      .then(() => {
        toast("Student added.", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      })
      .catch((error) => {
        toast("Student cannot be added.", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
  }

  function deleteStudent(index) {
    let tempStuds = [...students];
    deleteDoc(doc(db, "students", tempStuds[index]["email"]))
      .then(() => {
        toast("Student deleted.", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      })
      .catch((error) => {
        toast("Student cannot be deleted.", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
    tempStuds = tempStuds.filter((stud, i) => {
      return i !== index;
    });
    setStudents(tempStuds);
  }

  return (
    <>
      {students.length > 0 ? (
        <>
          <table className="studentControlTable">
            <tbody>
              <tr>
                <th>Sl. No.</th>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
              {students.map((student, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>
                      {/* <button
                        className="studentControlBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditIndex(index);
                        }}
                      >
                        ✏️
                      </button> */}
                      <button
                        className="studentControlBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteStudent(index);
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td>
                  <input
                    className="studentAddInput"
                    placeholder="Enter Student Name"
                    onChange={(e) => {
                      setStudentName(e.target.value);
                    }}
                    type="text"
                  />
                </td>
                <td>
                  <input
                    className="studentAddInput"
                    placeholder="Enter Student Email"
                    onChange={(e) => {
                      setStudentEmail(e.target.value);
                    }}
                    type="email"
                  />
                </td>
                <td>
                  <button className="addStudentBtn" onClick={addStudent}>
                    ➕ㅤAdd Student
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <Toaster position="top-left" reverseOrder={false} />
        </>
      ) : null}
    </>
  );
}
