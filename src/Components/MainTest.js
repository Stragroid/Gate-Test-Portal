import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RLCicon from "../assets/images/rlc-icon.png";
import CalculatorIcon from "../assets/images/calculator.jpeg";

export default function MainTest() {
  const [testStartTime, setTestStartTime] = useState(null);
  const [testDuration, setTestDuration] = useState(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [testid, setTestId] = useState(null);
  const [online, setOnline] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [notAnswered, setNotAnswered] = useState(0);
  const [notVisited, setNotVisited] = useState(0);
  const [answeredReview, setAnsweredReview] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState(null);
  const [studentID, setStudentID] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    getDocs(query(collection(db, "test")))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setOnline(doc.data().online);
          setTestId(doc.id);
          setTestStartTime(doc.data().startTime.toDate());
          setTestDuration(doc.data().duration);
          const map = new Map(Object.entries(doc.data().questions));
          let quests = [];
          map.forEach(function (value, key) {
            quests.push(value);
          });
          // console.log(quests);
          setQuestions(quests);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    getDocs(query(collection(db, "students"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().email === user.email) {
          setStudentID(doc.id);
          setUserName(doc.data().username);
          let ans = [];
          const map = new Map(Object.entries(doc.data().answers));
          let answered = 0,
            notAnswered = 0,
            notVisited = 0,
            answeredReview = 0,
            markedForReview = 0;
          map.forEach(function (value, key) {
            if (value.status === "na") notAnswered++;
            else if (value.status === "a") answered++;
            else if (value.status === "nv") notVisited++;
            else if (value.status === "amr") answeredReview++;
            else if (value.status === "mr") markedForReview++;
            ans.push(value);
          });
          setAnswered(answered);
          setNotAnswered(notAnswered);
          setNotVisited(notVisited);
          setAnsweredReview(answeredReview);
          setMarkedForReview(markedForReview);
          setStudentAnswers(ans);
        }
      });
    });
  }, []);

  useEffect(() => {
    try {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typeset();
      }
    } catch (err) {
      // console.log(err);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      TimeLeft(testStartTime, testDuration);
    }, 1000);
    return () => clearInterval(interval);
  });

  function handleSubmit() {
    saveAnswers(user.email);
    updateDoc(doc(db, "students", studentID), {
      attended: true,
    }).then(() => {
      signOut(auth)
        .then(() => {
          console.log("Signed out successfully!");
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    });
  }

  function changeStatus() {
    updateDoc(doc(db, "test", testid), { online: !online });
    setOnline(!online);
  }

  function TimeLeft(testStartTime, testDuration) {
    if (!testStartTime || !testDuration) return "00:00:00";
    const timeElapsed = Math.floor((Date.now() - testStartTime) / 1000);
    const timeLeft = testDuration * 60 - timeElapsed;
    let hours = Math.floor(timeLeft / 3600);
    let minutes = Math.floor((timeLeft % 3600) / 60);
    let seconds = timeLeft % 60;
    hours < 10 ? (hours = `0${hours}`) : (hours = `${hours}`);
    minutes < 10 ? (minutes = `0${minutes}`) : (minutes = `${minutes}`);
    seconds < 10 ? (seconds = `0${seconds}`) : (seconds = `${seconds}`);
    if (timeLeft <= 0) {
      handleSubmit();
      changeStatus();
    }
    setTimeLeft(`${hours}:${minutes}:${seconds}`);
  }

  function saveAnswers(email) {
    let savedAnswers = {};
    for (let i = 0; i < questions.length; i++) {
      savedAnswers[i] = {
        status: studentAnswers[i].status,
        answer: studentAnswers[i].answer,
      };
    }
    updateDoc(doc(db, "students", studentID), {
      answers: savedAnswers,
    });
  }

  function handleOnLoadRadio(index, id) {
    if (document.getElementById(id) !== null) {
      if (studentAnswers[index].answer.includes(id[id.length - 1])) {
        document.getElementById(id).checked = true;
      }
    }
  }

  return questions && studentAnswers ? (
    <>
      <header style={{ backgroundColor: "#3b5998" }}>
        <img src={RLCicon} height="80" alt="banner" />
      </header>
      <div id="exam_name" className="calc left">
        <div className="exam_names">RLC GATE TEST 1</div>
        <button style={{ height: "32px", width: "32px", overflow: "hidden" }}>
          <img
            src={CalculatorIcon}
            style={{ cursor: "pointer", height: "30px", width: "30px" }}
            alt="calculator"
            onClick={() => {
              window.open(
                "https://www.tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html",
                "Calculator",
                "width=480,height=340"
              );
            }}
          />
        </button>
      </div>
      <div id="time" className="left">
        <div id="time_left">Time Left: {timeLeft}</div>
      </div>

      <div id="question_area_scrollable" className="left">
        <div className="question-title">
          <div id="question-title">
            Question no. {currentQuestionIndex + 1}
            {" ("}
            {questions[currentQuestionIndex].questionType === "somcq"
              ? "Single Correct"
              : questions[currentQuestionIndex].questionType === "momcq"
              ? "Multiple Correct"
              : "Numerical"}
            {")"}
            {" { +"}
            {questions[currentQuestionIndex].marksOnCorrect}
            {" , "}
            {questions[currentQuestionIndex].marksOnIncorrect}
            {" }"}
          </div>
        </div>
        {/* <img
            id="section_info_img"
            src="https://www.digialm.com/per/g01/pub/379/ASM/OnlineAssessment/M2/tkcimages/EP1S1.jpg"
          /> */}
        <div id="quiz">
          {questions.map((question, index) => {
            return (
              <>
                <div
                  className="question"
                  style={{
                    display: index === currentQuestionIndex ? "block" : "none",
                    marginTop: "10px",
                    marginLeft: "10px",
                  }}
                  key={index + 1}
                >
                  {question.q}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={question.questionImageUrl}
                      alt="questionImage"
                      style={{
                        display:
                          question.questionImageUrl !== "" ? "block" : "none",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="answers"
                  style={{
                    display: index === currentQuestionIndex ? "block" : "none",
                  }}
                  key={-index - 1}
                >
                  {question.questionType === "somcq" ? (
                    <>
                      <label>
                        <input
                          type="radio"
                          name={index}
                          value="A"
                          id={index + "a"}
                          onLoad={handleOnLoadRadio(index, `${index}a`)}
                          onChange={() => {
                            let q = studentAnswers;
                            q[index].answer = "a";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o1}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index}
                          value="B"
                          id={index + "b"}
                          onLoad={handleOnLoadRadio(index, `${index}b`)}
                          onChange={() => {
                            let q = studentAnswers;
                            q[index].answer = "b";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o2}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index}
                          value="C"
                          id={index + "c"}
                          onLoad={handleOnLoadRadio(index, `${index}c`)}
                          onChange={() => {
                            let q = studentAnswers;
                            q[index].answer = "c";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o3}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index}
                          value="D"
                          id={index + "d"}
                          onLoad={handleOnLoadRadio(index, `${index}d`)}
                          onChange={() => {
                            let q = studentAnswers;
                            q[index].answer = "d";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o4}
                      </label>
                    </>
                  ) : question.questionType === "momcq" ? (
                    <>
                      <label>
                        <input
                          type="radio"
                          name={index + "a"}
                          value="A"
                          id={index + "a"}
                          onLoad={handleOnLoadRadio(index, `${index}a`)}
                          // checked={studentAnswers[index].answer.includes("a")}
                          onClick={(e) => {
                            let q = studentAnswers;
                            if (q[index].answer.includes("a"))
                              q[index].answer = q[index].answer.replace(
                                "a",
                                ""
                              );
                            else q[index].answer += "a";
                            e.target.checked = !e.target.checked;
                            setStudentAnswers(q);
                          }}
                          onChange={() => {
                            let q = studentAnswers;

                            if (!q[index].answer.includes("a"))
                              q[index].answer += "a";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o1}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index + "b"}
                          value="B"
                          id={index + "b"}
                          onLoad={handleOnLoadRadio(index, `${index}b`)}
                          // checked={studentAnswers[index].answer.includes("b")}
                          onClick={(e) => {
                            let q = studentAnswers;
                            if (q[index].answer.includes("b"))
                              q[index].answer = q[index].answer.replace(
                                "b",
                                ""
                              );
                            else q[index].answer += "b";
                            e.target.checked = !e.target.checked;
                            setStudentAnswers(q);
                          }}
                          onChange={() => {
                            let q = studentAnswers;
                            if (!q[index].answer.includes("b"))
                              q[index].answer += "b";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o2}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index + "c"}
                          value="C"
                          id={index + "c"}
                          onLoad={handleOnLoadRadio(index, `${index}c`)}
                          // checked={studentAnswers[index].answer.includes("c")}
                          onClick={(e) => {
                            let q = studentAnswers;
                            if (q[index].answer.includes("c"))
                              q[index].answer = q[index].answer.replace(
                                "c",
                                ""
                              );
                            else q[index].answer += "c";
                            e.target.checked = !e.target.checked;
                            setStudentAnswers(q);
                          }}
                          onChange={() => {
                            let q = studentAnswers;
                            if (!q[index].answer.includes("c"))
                              q[index].answer += "c";
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o3}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index + "d"}
                          value="D"
                          id={index + "d"}
                          onLoad={handleOnLoadRadio(index, `${index}d`)}
                          // checked={studentAnswers[index].answer.includes("d")}
                          onClick={(e) => {
                            let q = studentAnswers;
                            if (q[index].answer.includes("d"))
                              q[index].answer = q[index].answer.replace(
                                "d",
                                ""
                              );
                            else q[index].answer += "d";
                            e.target.checked = !e.target.checked;
                            setStudentAnswers(q);
                          }}
                          onChange={() => {
                            let q = studentAnswers;
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                        &nbsp;{question.o4}
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        <input
                          type="text"
                          name={index}
                          defaultValue={studentAnswers[index].answer}
                          id={index}
                          onChange={(e) => {
                            let q = studentAnswers;
                            q[index].answer = e.target.value;
                            if (
                              q[index].status === "mr" ||
                              q[index].status === "amr"
                            ) {
                              if (q[index].status === "mr") {
                                setMarkedForReview(markedForReview + 1);
                                setAnsweredReview(answeredReview + 1);
                              }
                              q[index].status = "amr";
                            } else {
                              if (q[index].status === "na") {
                                setNotAnswered(notAnswered - 1);
                                setAnswered(answered + 1);
                              }
                              q[index].status = "a";
                            }
                            setStudentAnswers(q);
                          }}
                        />
                      </label>
                    </>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>

      <div id="next_options" className="left">
        <div
          id="mfran"
          className="button"
          onClick={() => {
            let q = studentAnswers;
            if (q[currentQuestionIndex].status === "na") {
              q[currentQuestionIndex].status = "mr";
              setStudentAnswers(q);
              setNotAnswered(notAnswered - 1);
              setMarkedForReview(markedForReview + 1);
            } else if (q[currentQuestionIndex].status === "a") {
              q[currentQuestionIndex].status = "amr";
              setStudentAnswers(q);
              setAnswered(answered - 1);
              setAnsweredReview(answeredReview + 1);
            } else if (q[currentQuestionIndex].status === "mr") {
              q[currentQuestionIndex].status = "na";
              setStudentAnswers(q);
              setMarkedForReview(markedForReview - 1);
              setNotAnswered(notAnswered + 1);
            } else if (q[currentQuestionIndex].status === "amr") {
              q[currentQuestionIndex].status = "a";
              setStudentAnswers(q);
              setAnswered(answered + 1);
              setAnsweredReview(answeredReview - 1);
            }
          }}
        >
          Mark for Review
        </div>
        <div
          id="cr"
          className="button"
          onClick={() => {
            let q = studentAnswers;
            if (q[currentQuestionIndex].status === "a") {
              setAnswered(answered - 1);
              q[currentQuestionIndex].status = "na";
              setNotAnswered(notAnswered + 1);
            } else if (q[currentQuestionIndex].status === "amr") {
              setAnsweredReview(answeredReview - 1);
              q[currentQuestionIndex].status = "mr";
              setMarkedForReview(markedForReview + 1);
            }
            q[currentQuestionIndex].answer = "";
            if (
              questions[currentQuestionIndex].questionType.includes("somcq")
            ) {
              let radio = document.getElementsByName(currentQuestionIndex);
              for (let i = 0; i < radio.length; i++) {
                radio[i].checked = false;
              }
            } else if (
              questions[currentQuestionIndex].questionType.includes("momcq")
            ) {
              document.getElementsByName(
                currentQuestionIndex + "a"
              )[0].checked = false;
              document.getElementsByName(
                currentQuestionIndex + "b"
              )[0].checked = false;
              document.getElementsByName(
                currentQuestionIndex + "c"
              )[0].checked = false;
              document.getElementsByName(
                currentQuestionIndex + "d"
              )[0].checked = false;
            } else {
              let text = document.getElementById(currentQuestionIndex);
              text.value = "";
            }
            setStudentAnswers(q);
          }}
        >
          Clear Response
        </div>
        <div id="pre" className="button" style={{ opacity: 0 }}>
          Previous
        </div>
        <div
          id="next"
          className="button"
          onClick={() => {
            if (currentQuestionIndex < questions.length - 1) {
              let q = studentAnswers;
              if (q[currentQuestionIndex + 1].status === "nv") {
                q[currentQuestionIndex + 1].status = "na";
                setNotAnswered(notAnswered + 1);
                setNotVisited(notVisited - 1);
              }
              setStudentAnswers(q);
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
            saveAnswers(user.email);
          }}
        >
          Save and Next
        </div>
      </div>

      <div id="sidebar">
        <div id="person_info">
          <div>
            <img
              id="profile_img"
              src="https://www.digialm.com//OnlineAssessment/images/NewCandidateImage.jpg"
            />
          </div>
          <div id="cname">{userName}</div>
        </div>
        <div id="border">
          <div id="color_info">
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-7px -55px" }}
              >
                {answered}
              </span>
              <span className="just_6">Answered</span>
            </div>
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-42px -56px" }}
              >
                {notAnswered}
              </span>
              <span className="just_6">Not Answered</span>
            </div>
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-107px -56px" }}
              >
                {notVisited}
              </span>
              <span className="just_6">Not Visited</span>
            </div>
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-75px -54px" }}
              >
                {markedForReview}
              </span>
              <span className="just_6">Marked for Review</span>
            </div>
            <div className="just_4" id="long">
              <span
                className="just_5"
                style={{ backgroundPosition: "-9px -87px" }}
              >
                {answeredReview}
              </span>
              <span className="just_6">
                Answered & Marked for Review (will be considered for evaluation)
              </span>
            </div>
          </div>
          <div id="small_header">Question Pallete</div>
          <div id="questions_select_area">
            <div id="choose_text">Choose a Question</div>
            <div id="palette-list">
              {studentAnswers.map((answer, index) => {
                return (
                  <div
                    className={`item ${answer.status}`}
                    key={index}
                    onClick={(e) => {
                      setCurrentQuestionIndex(index);
                      if (answer.status === "nv") {
                        answer.status = "na";
                        setNotVisited(notVisited - 1);
                        setNotAnswered(notAnswered + 1);
                      }
                    }}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div id="submit_container">
        <div
          className="button"
          id="submit"
          onClick={() => {
            if (window.confirm("Are you sure you want to submit the test?")) {
              handleSubmit();
            }
          }}
        >
          Submit
        </div>
      </div>

      <div id="results" className="left"></div>

      <div id="favourites_view"></div>

      <footer id="ultimate_footer"></footer>
    </>
  ) : null;
}
