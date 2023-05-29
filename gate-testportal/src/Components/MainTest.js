import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function MainTest() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
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
  return (
    <>
      <header style={{ backgroundColor: "#3b5998" }}>
        <img
          src="https://www.digialm.com/per/g01/pub/379/ASM/OnlineAssessment/M2/banner.png"
          height="50"
          alt="banner"
        />
      </header>
      <div id="header_1">
        Paper1
        <div className="just_2">
          <div>Instructions</div>
        </div>
        <div className="just_2">
          <div>Question Paper</div>
        </div>
      </div>
      <div id="exam_name" className="left">
        <div className="exam_names">JEE Advanced 2019</div>
      </div>
      <div id="time" className="left">
        Section
        <div id="time_left">Time Left:</div>
      </div>
      <div id="section_names" className="left">
        <div className="section_selected">Phy Sec 1</div>
        <div className="section_unselected">Phy Sec 1</div>
        <div className="section_unselected">Phy Sec 1</div>
        <div className="section_unselected">Phy Sec 1</div>
      </div>
      <div id="view_in_lang" className="left">
        <select id="lang_select" className="just_3">
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
        <div className="just_3">View in:</div>
      </div>

      <div id="question_area_scrollable" className="left">
        <div className="question-title">
          <div id="question-title">Question no. 1 </div>
          <button id="favourite" style={{ float: "right" }}>
            Save
          </button>
        </div>
        <div id="area_with_background">
          {/* <img
                    id="section_info_img"
                    src="https://www.digialm.com/per/g01/pub/379/ASM/OnlineAssessment/M2/tkcimages/EP1S1.jpg"
                  /> */}
          <div id="quiz"></div>
        </div>
      </div>

      <div id="next_options" className="left">
        <div id="mfran" className="button">
          Mark for Review & Next
        </div>
        <div id="cr" className="button">
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
                0
              </span>
              <span className="just_6">Answered</span>
            </div>
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-42px -56px" }}
              >
                0
              </span>
              <span className="just_6">Not Answered</span>
            </div>
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-107px -56px" }}
              >
                0
              </span>
              <span className="just_6">Not Visited</span>
            </div>
            <div className="just_4">
              <span
                className="just_5"
                style={{ backgroundPosition: "-75px -54px" }}
              >
                0
              </span>
              <span className="just_6">Marked for Review</span>
            </div>
            <div className="just_4" id="long">
              <span
                className="just_5"
                style={{ backgroundPosition: "-9px -87px" }}
              >
                0
              </span>
              <span className="just_6">
                Answered & Marked for Review (will be considered for evaluation)
              </span>
            </div>
          </div>
          <div id="small_header">Phy Sec 1</div>
          <div id="questions_select_area">
            <div id="choose_text">Choose a Question</div>
            <div id="palette-list">
              <div className="a item">1</div>
              <div className="na item">2</div>
              <div className="nv item">3</div>
              <div className="mr item">4</div>
              <div className="amr item">5</div>
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
      <div id="favourite_box">
        <button id="reload">Reload</button>
        <input
          type="checkbox"
          name="a"
          id="f_choice"
          value={"Show Only Favourites"}
        />
      </div>

      <div id="favourites_view"></div>

      <footer id="ultimate_footer"></footer>

      <select
        id="topics_list"
        style={{ position: "absolute", right: "0px", top: "0px" }}
      >
        <option value="volvo">Select</option>
      </select>
    </>
  );
}
