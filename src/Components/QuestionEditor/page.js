import "./style.css";
import { db, auth } from "../../firebaseConfig";
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
          quests.push(value);
        });
        setQuestions(quests);
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
      newQuestions[i + 1] = {
        q: q,
        o1: o1,
        o2: o2,
        o3: o3,
        o4: o4,
        a: a,
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
                        <div className={"q" + (index + 1)} key={index + 1}>
                          <div className="q">
                            <label htmlFor="question">Question</label>
                            <input
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
                          <button onClick={removeQuestion(index)}>
                            Remove
                          </button>
                        </div>
                      );
                    })
                  : null}
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
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
              <div style={{ display: "flex", flexDirection: "row" }}>
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
              <button onClick={changeStatus}>
                Make Test {online ? "Offline" : "Online"}
              </button>
              <button onClick={uploadTest}>Upload Test</button>
              <button onClick={addQuestion}>Add a question</button>
              <button onClick={clearTest}>Clear test</button>
              <button onClick={logout}>Logout</button>
            </>
          ) : null
        ) : (
          navigate("/")
        )
      ) : null}
    </>
  );
}
