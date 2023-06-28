import "./style.css";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Answers from "../Answers/page";
import { useState } from "react";

export default function NoTestPage() {
  const [user, loading] = useAuthState(auth);
  const [isResult, setIsResult] = useState(false);
  const navigate = useNavigate();

  function logout(e) {
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
      {isResult ? (
        <Answers />
      ) : (
        <div className="noTestBody">
          <div className="noTestMain">
            {user.email}
            <br />
            You don't have any upcoming tests yet.
            <div>
              <button
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reload
              </button>
              &nbsp;&nbsp;
              {/* <button
                onClick={() => {
                  setIsResult(true);
                }}
              >
                Results of previous test
              </button> */}
              &nbsp;&nbsp;
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
