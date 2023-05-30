import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import rlcIcon from "../../assets/images/rlc-icon.png";

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
      {/* <div className="flex flex-col items-center justify-center py-2 mainDiv">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-white-900">
              ㅤㅤSign in to playㅤㅤ
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-red-900 text-center"
            >
              {errorMessage}
            </label>
            <form className="space-y-6" onSubmit={handleSigninClick}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e) => validateEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white-900 shadow-sm ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => validatePassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-white-900 shadow-sm ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-white-500">
              New User?{" "}
              <Link to={`/signup`}>
                <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Sign Up
                </span>
              </Link>
            </p>
            <p className="mt-5 text-center text-sm text-white-500">
              Admin?{" "}
              <Link to={`/adminLogin`}>
                <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Admin Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div> */}
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
