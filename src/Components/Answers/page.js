import { db, auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RLCicon from "../../assets/images/rlc-icon.png";
import "./style.css";

export default function Answers() {
  const [user, loading] = useAuthState(auth);
  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [notAnswered, setNotAnswered] = useState(0);
  const [notVisited, setNotVisited] = useState(0);
  const [answeredReview, setAnsweredReview] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    getDocs(query(collection(db, "test")))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const map = new Map(Object.entries(doc.data().questions));
          let quests = [];
          map.forEach(function (value, key) {
            quests.push(value);
          });
          console.log(quests);
          setQuestions(quests);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    getDocs(query(collection(db, "students"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().email === user.email) {
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

  function handleOnLoadRadio(index, id) {
    if (document.getElementById(id) !== null) {
      if (studentAnswers[index].answer.includes(id[id.length - 1])) {
        document.getElementById(id).checked = true;
      }
    }
  }

  function findMarks(index) {
    if (
      studentAnswers[index].status === "a" ||
      studentAnswers[index].status === "amr"
    ) {
      if (questions[index].questionType === "momcq") {
        let ans = studentAnswers[index].answer.split("");
        let correct = questions[index].a.split("");
        let flag = true;
        for (let i = 0; i < ans.length; i++) {
          if (!correct.includes(ans[i])) {
            flag = false;
            break;
          }
        }
        if (flag) {
          return questions[index].marksOnCorrect;
        } else {
          return questions[index].marksOnIncorrect;
        }
      } else {
        if (studentAnswers[index].answer === questions[index].a)
          return questions[index].marksOnCorrect;
        else return questions[index].marksOnIncorrect;
      }
    } else return 0;
  }

  return questions && studentAnswers ? (
    <>
      <header style={{ backgroundColor: "#3b5998" }}>
        <img src={RLCicon} height="80" alt="banner" />
      </header>
      <div id="exam_name" className="calc left">
        <div className="exam_names">RLC GATE TEST 1</div>
        <div
          className="logoutBtn"
          style={{ overflow: "hidden" }}
          onClick={() => {
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
          }}
        >
          Logout
        </div>
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
                          checked={studentAnswers[index].answer.includes("a")}
                          readOnly
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
                          checked={studentAnswers[index].answer.includes("b")}
                          readOnly
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
                          checked={studentAnswers[index].answer.includes("c")}
                          readOnly
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
                          checked={studentAnswers[index].answer.includes("d")}
                          readOnly
                        />
                        &nbsp;{question.o4}
                      </label>
                      <div className="answerExplanation">
                        <p>Correct Answer: {question.a}</p>
                        <p>Marks Obtained: {findMarks(index)}</p>
                        <p>
                          Explanation:
                          <span>
                            <img
                              alt="explanationImage"
                              src={question.explanationImageUrl}
                              style={{
                                display:
                                  question.explanationImageUrl === ""
                                    ? "none"
                                    : "block",
                              }}
                            />
                            {question.explanation}
                          </span>
                        </p>
                      </div>
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
                          checked={studentAnswers[index].answer.includes("a")}
                          readOnly
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
                          checked={studentAnswers[index].answer.includes("b")}
                          readOnly
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
                          checked={studentAnswers[index].answer.includes("c")}
                          readOnly
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
                          checked={studentAnswers[index].answer.includes("d")}
                          readOnly
                        />
                        &nbsp;{question.o4}
                      </label>
                      <div className="answerExplanation">
                        <p>Correct Answer: {question.a}</p>
                        <p>Marks Obtained: {findMarks(index)}</p>
                        <p>
                          Explanation:
                          <span>
                            <img
                              alt="explanationImage"
                              src={question.explanationImageUrl}
                              style={{
                                display:
                                  question.explanationImageUrl === ""
                                    ? "none"
                                    : "block",
                              }}
                            />
                            {question.explanation}
                          </span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <label>
                        <input
                          type="text"
                          name={index}
                          defaultValue={studentAnswers[index].answer}
                          id={index}
                          readOnly
                        />
                      </label>
                      <div className="answerExplanation">
                        <p>Correct Answer: {question.a}</p>
                        <p>Marks Obtained: {findMarks(index)}</p>
                        <p>
                          Explanation: <br />
                          <span>
                            <img
                              alt="explanationImage"
                              src={question.explanationImageUrl}
                              style={{
                                display:
                                  question.explanationImageUrl === ""
                                    ? "none"
                                    : "block",
                              }}
                            />
                            {question.explanation}
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })}
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
    </>
  ) : null;
}
