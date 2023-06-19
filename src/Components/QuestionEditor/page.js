import "./style.css";
import { db, auth, storage } from "../../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function QuestionEditor() {
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState(null);
  const [testid, setTestId] = useState(null);
  const [online, setOnline] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(true);
  const [testStartTimestamp, setTestStartTimestamp] = useState(null); // [timestamp, setTimestamp
  const [testDuration, setTestDuration] = useState(null); // [timestamp, setTimestamp
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "test"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setOnline(doc.data().online);
        setTestId(doc.id);
        const map = new Map(Object.entries(doc.data().questions));
        setQuestionCount(map.size);
        let quests = [];
        map.forEach(function (value, key) {
          if(!value.questionImageUrl || value.questionImageUrl === '')
            value.questionImageUrl = '';
          quests.push(value);
        });
        setQuestions(quests);
        //https://firebasestorage.googleapis.com/v0/b/rlc-gate-test-portal.appspot.com/o/q1?alt=media
        setTestStartTimestamp(doc.data().startTime.toDate());
        setTestDuration(doc.data().duration);
      });
    });
    if (user) {
      const q1 = query(
        collection(db, "admin"),
        where("email", "==", user.email)
      );
      getDocs(q1).then((querySnapshot) => {
        if (querySnapshot.empty) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      });
    }
  }, [user]);

  function removeQuestion(index) {
    return () => {
      let quests = [...questions];
      quests.splice(index, 1);
      setQuestions(quests);
      setQuestionCount(questionCount - 1);
    };
  }

  function changeStatus() {
    updateDoc(doc(db, "test", testid), { online: !online });
    setOnline(!online);
  }

  function addQuestion() {
    let quests = [...questions];
    quests.push({
      q: "",
      o1: "",
      o2: "",
      o3: "",
      o4: "",
      a: "",
    });
    setQuestions(quests);
    setQuestionCount(questionCount + 1);
  }

  function ISOtoLocal(time) {
    const z = new Date().getTimezoneOffset() * 60 * 1000;
    time = time - z;
    time = new Date(time).toISOString();
    time = time.split(".")[0];
    return time;
  }

  function uploadTest() {
    // Convert questions array to map
    let newQuestions = {};
    for (let i = 0; i < questionCount; i++) {
      let q = questions[i].q;
      let o1 = questions[i].o1;
      let o2 = questions[i].o2;
      let o3 = questions[i].o3;
      let o4 = questions[i].o4;
      let a = questions[i].a;
      let questionType = questions[i].questionType;
      let marksOnCorrect = questions[i].marksOnCorrect;
      let marksOnIncorrect = questions[i].marksOnIncorrect;
      let questionImageUrl = questions[i].questionImageUrl;
      newQuestions[i + 1] = {
        q: q,
        o1: o1,
        o2: o2,
        o3: o3,
        o4: o4,
        a: a,
        questionType: questionType,
        marksOnCorrect: marksOnCorrect,
        marksOnIncorrect: marksOnIncorrect,
        questionImageUrl: questionImageUrl,
      };
    }
    let test = {
      questions: newQuestions,
      startTime: Timestamp.fromDate(new Date(testStartTimestamp)),
      duration: testDuration,
    };
    updateDoc(doc(db, "test", testid), test);
  }

  function clearTest() {
    setQuestions([]);
    setQuestionCount(0);
  }

  function logout(e) {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully!");
        navigate("/admin");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  function updateStudentDB() {
    const q = query(collection(db, "students"));
    let answer = {};
    for (let i = 0; i < questionCount; i++) {
      answer[i + 1] = {
        answer: "",
        status: i === 0 ? "na" : "nv",
      };
    }
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((student) => {
        updateDoc(doc(db, "students", student.id), {
          attended: false,
          answers: answer,
        });
      });
    });
  }

  return (
    <>
      {user ? (
        isAdmin ? (
          testStartTimestamp && testDuration ? (
            <>
              <div className="questions">
                {questions !== null
                  ? questions.map((question, index) => {
                      return (
                        <div
                          className={"editableQuestion q" + (index + 1)}
                          key={index + 1}
                        >
                          <div className="q">
                            <label htmlFor="question">Question</label>
                            <textarea
                              type="text"
                              name="question"
                              id="question"
                              defaultValue={question.q}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].q = e.target.value;
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="o1">
                            <label htmlFor="option1">Option 1</label>
                            <input
                              type="text"
                              name="option1"
                              id="option1"
                              defaultValue={question.o1}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].o1 = e.target.value;
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="o2">
                            <label htmlFor="option2">Option 2</label>
                            <input
                              type="text"
                              name="option2"
                              id="option2"
                              defaultValue={question.o2}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].o2 = e.target.value;
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="o3">
                            <label htmlFor="option3">Option 3</label>
                            <input
                              type="text"
                              name="option3"
                              id="option3"
                              defaultValue={question.o3}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].o3 = e.target.value;
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="o4">
                            <label htmlFor="option4">Option 4</label>
                            <input
                              type="text"
                              name="option4"
                              id="option4"
                              defaultValue={question.o4}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].o4 = e.target.value;
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="answer">
                            <label htmlFor="answer">Answer</label>
                            <input
                              type="text"
                              name="answer"
                              id="answer"
                              defaultValue={question.a}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].a = e.target.value;
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="questionType">
                            <label htmlFor="questionType">Question Type</label>
                            <select
                              name="questionType"
                              id="questionType"
                              defaultValue={question.questionType}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].questionType = e.target.value;
                                setQuestions(quests);
                              }}
                            >
                              <option value="somcq">Single Option MCQ</option>
                              <option value="momcq">Multiple Option MCQ</option>
                              <option value="numerical">Numerical</option>
                            </select>
                          </div>
                          <div className="marksOnCorrect">
                            <label htmlFor="marksOnCorrect">
                              Marks on Correct
                            </label>
                            <input
                              type="text"
                              name="marksOnCorrect"
                              id="marksOnCorrect"
                              defaultValue={question.marksOnCorrect}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].marksOnCorrect = parseInt(
                                  e.target.value
                                );
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="marksOnInCorrect">
                            <label htmlFor="marksOnInCorrect">
                              Marks on Incorrect
                            </label>
                            <input
                              type="text"
                              name="marksOnInCorrect"
                              id="marksOnInCorrect"
                              defaultValue={question.marksOnIncorrect}
                              onChange={(e) => {
                                let quests = [...questions];
                                quests[index].marksOnIncorrect = parseInt(
                                  e.target.value
                                );
                                setQuestions(quests);
                              }}
                            />
                          </div>
                          <div className="questionImageUpload">
                            <label htmlFor="questionImageUpload">
                              Upload Image
                            </label>
                            {/* {questions[index].questionImageUrl !== "" ? ( */}
                            <img
                              id={`questionImage${index + 1}`}
                              src={questions[index].questionImageUrl}
                              alt="questionImage"
                              style={{
                                display:
                                  questions[index].questionImageUrl !== ""
                                    ? "block"
                                    : "none",
                              }}
                            />
                            {/* ) : ( */}
                            <p
                              id={`questionImageText${index + 1}`}
                              style={{
                                display:
                                  questions[index].questionImageUrl === ""
                                    ? "block"
                                    : "none",
                              }}
                            >
                              No image for this question
                            </p>
                            {/* )} */}

                            <input
                              type="file"
                              name="questionImageUpload"
                              id="questionImageUpload"
                              onChange={(e) => {
                                const name = `q${index + 1}`;
                                const REF = ref(storage, name);
                                const file = e.target.files[0];
                                const metadata = {
                                  contentType: file.type,
                                };
                                uploadBytes(REF, file, metadata)
                                  .then((snapshot) => {
                                    let temp = questions;
                                    temp[
                                      index
                                    ].questionImageUrl = `https://firebasestorage.googleapis.com/v0/b/rlc-gate-test-portal.appspot.com/o/q${
                                      index + 1
                                    }?alt=media`;
                                    setQuestions(temp);
                                    document.getElementById(
                                      `questionImage${index + 1}`
                                    ).src = URL.createObjectURL(e.target.files[0]);
                                    document.getElementById(
                                      `questionImage${index + 1}`
                                    ).style.display = "block";
                                    document.getElementById(
                                      `questionImageText${index + 1}`
                                    ).style.display = "none";
                                    console.log(`Image for ${name} uploaded`);
                                  })
                                  .catch(console.error);
                                // console.log(e.target.files[0]);
                              }}
                            />
                          </div>
                          <button
                            className="removeBtn"
                            onClick={removeQuestion(index)}
                          >
                            Remove Question
                          </button>
                        </div>
                      );
                    })
                  : null}
              </div>
              <button className="addQuestionBtn" onClick={addQuestion}>
                Add a question
              </button>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className="questions"
              >
                <label htmlFor="testStartTime">Start Of Test: </label>
                <input
                  type="datetime-local"
                  name="testStartTime"
                  id="testStartTime"
                  defaultValue={ISOtoLocal(testStartTimestamp)}
                  onChange={(e) => {
                    setTestStartTimestamp(new Date(e.target.value));
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className="questions"
              >
                <label htmlFor="testDuration">Duration(in minutes): </label>
                <input
                  type="text"
                  name="testDuration"
                  id="testDuration"
                  defaultValue={testDuration}
                  onChange={(e) => {
                    setTestDuration(e.target.value);
                  }}
                />
              </div>
              <div className="btnGroup">
                <button
                  className="btn"
                  id="makeTestOnlineBtn"
                  onClick={changeStatus}
                >
                  Make Test {online ? "Offline" : "Online"}
                </button>
                <button
                  className="btn"
                  id="updateStudentBtn"
                  onClick={updateStudentDB}
                >
                  Update Student Database
                </button>
                <button className="btn" id="uploadTestBtn" onClick={uploadTest}>
                  Upload Test
                </button>
                <button className="btn" id="clearTestBtn" onClick={clearTest}>
                  Clear test
                </button>
                <button className="btn" id="logOutBtn" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          ) : null
        ) : (
          navigate("/")
        )
      ) : null}
    </>
  );
}
