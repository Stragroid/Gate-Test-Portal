import "./style.css";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function NoTestPage() {
  const [user, loading] = useAuthState(auth);
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
      <div className="noTestBody">
        <div className="noTestMain">
        {user.email}<br/>
          You don't have any upcoming tests yet.
          <div>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>&nbsp;&nbsp;
          <button
            onClick={logout}
          >
            logout
          </button></div>
        </div>
      </div>
    </>
  );
}
