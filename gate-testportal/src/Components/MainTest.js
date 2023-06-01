import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RLCicon from "../assets/images/rlc-icon.png";

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
  const [notAnswered, setNotAnswered] = useState(1);
  const [notVisited, setNotVisited] = useState(0);
  const [answeredReview, setAnsweredReview] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "test"));
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setOnline(doc.data().online);
          setTestId(doc.id);
          setTestStartTime(doc.data().startTime.toDate());
          setTestDuration(doc.data().duration);
          const map = new Map(Object.entries(doc.data().questions));
          let quests = [];
          map.forEach(function (value, key) {
            value.status = "nv";
            quests.push(value);
          });
          quests[0].status = "na";
          setNotVisited(quests.length - 1);
          setQuestions(quests);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      TimeLeft(testStartTime, testDuration);
    }, 1000);
    return () => clearInterval(interval);
  });

  function handleSubmit() {
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

  return questions ? (
    <>
      <header style={{ backgroundColor: "#3b5998" }}>
        <img src={RLCicon} height="80" alt="banner" />
      </header>
      <div id="exam_name" className="left">
        <div className="exam_names">RLC GATE TEST 1</div>
      </div>
      <div id="time" className="left">
        <div id="time_left">Time Left: {timeLeft}</div>
      </div>

      <div id="question_area_scrollable" className="left">
        <div className="question-title">
          <div id="question-title">
            Question no. {currentQuestionIndex + 1}{" "}
          </div>
          <button id="favourite" style={{ float: "right" }}>
            Save
          </button>
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
                  }}
                >
                  {question.q}
                </div>
                <div
                  className="answers"
                  style={{
                    display: index === currentQuestionIndex ? "block" : "none",
                  }}
                >
                  <label>
                    <input
                      type="radio"
                      name={index}
                      value="A"
                      checked={question.answer === "a"}
                      onChange={() => {
                        let q = questions;
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
                        setQuestions(q);
                      }}
                    />
                    &nbsp;{question.o1}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={index}
                      value="B"
                      checked={question.answer === "b"}
                      onChange={() => {
                        let q = questions;
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
                        setQuestions(q);
                      }}
                    />
                    &nbsp;{question.o2}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={index}
                      value="C"
                      checked={question.answer === "c"}
                      onChange={() => {
                        let q = questions;
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
                        setQuestions(q);
                      }}
                    />
                    &nbsp;{question.o3}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={index}
                      value="D"
                      checked={question.answer === "d"}
                      onChange={() => {
                        let q = questions;
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
                        setQuestions(q);
                      }}
                    />
                    &nbsp;{question.o4}
                  </label>
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
            let q = questions;
            if (q[currentQuestionIndex].status === "na") {
              q[currentQuestionIndex].status = "mr";
              setQuestions(q);
              setNotAnswered(notAnswered - 1);
              setMarkedForReview(markedForReview + 1);
            } else if (q[currentQuestionIndex].status === "a") {
              q[currentQuestionIndex].status = "amr";
              setQuestions(q);
              setAnswered(answered - 1);
              setAnsweredReview(answeredReview + 1);
            } else if (q[currentQuestionIndex].status === "mr") {
              q[currentQuestionIndex].status = "na";
              setQuestions(q);
              setMarkedForReview(markedForReview - 1);
              setNotAnswered(notAnswered + 1);
            } else if (q[currentQuestionIndex].status === "amr") {
              q[currentQuestionIndex].status = "a";
              setQuestions(q);
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
            let q = questions;
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
            setQuestions(q);
          }}
        >
          Clear Response
        </div>
        <div id="pre" className="button" style={{ opacity: 0 }}>
          Previous
        </div>
        <div id="next" className="button">
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
          <div id="cname">{user.email}</div>
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
              {questions.map((question, index) => {
                return (
                  <div
                    className={`item ${question.status}`}
                    key={index}
                    onClick={(e) => {
                      setCurrentQuestionIndex(index);
                      if (question.status === "nv") {
                        question.status = "na";
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
        <div onClick={handleSubmit} className="button" id="submit">
          Submit
        </div>
      </div>

      <div id="results" className="left"></div>

      <div id="favourites_view"></div>

      <footer id="ultimate_footer"></footer>
    </>
  ) : null;
}
