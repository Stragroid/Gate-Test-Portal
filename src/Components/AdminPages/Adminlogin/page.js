import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import rlcIcon from "../../../assets/images/rlc-icon.png";

export default function Adminlogin() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleSigninClick(e) {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;
    const q = query(collection(db, "admin"), where("email", "==", email));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        setErrorMessage("User does not exist");
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isAdmin === true) {
            setErrorMessage("Admin cannot play the game");
          } else {
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                navigate("/admin/dashboard");
              })
              .catch((error) => {
                const errorCode = error.code;
                if (errorCode === "auth/wrong-password") {
                  setErrorMessage("Wrong password");
                }
              });
          }
        });
      }
    });
  }

  return (
    <>
      <div className="adminloginmain">
        <img src={rlcIcon} height="150" alt="rlc-icon" />
        <br />
        <h1 style={{ fontSize: "xx-large" }}>Test Portal</h1>
        <br />
        <label
          htmlFor="email"
          style={{
            color: "red",
            fontSize: "large",
            fontWeight: "bold",
            background: "transparent",
          }}
        >
          {errorMessage}
        </label>
        <form onSubmit={handleSigninClick} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <div className="cred">
            <div className="cred-name">
              Admin Username: &nbsp;
              <br />
              <br />
              <br />
              Admin Password: &nbsp;
            </div>
            <div className="cred-details">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
              <br />
              <br />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          <br />
          <button type="submit">Sign In</button>
        </form>
        <br />
        <Link to={`/`}>Are you a Student?</Link>
      </div>
    </>
  );
}
