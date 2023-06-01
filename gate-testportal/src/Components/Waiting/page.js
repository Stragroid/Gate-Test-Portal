import "./style.css";
import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function WaitingPage(props) {
  const [remTime, setRemTime] = useState(props.remTime);
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

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemTime = remTime - 1000;
      setRemTime(newRemTime);
      if (newRemTime <= 0) window.location.reload();
    }, 1000);
    return () => clearInterval(interval);
  });

  function transformTime(time) {
    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time - hours * 3600000) / 60000);
    let seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);
    hours < 10 ? (hours = `0${hours}`) : (hours = `${hours}`);
    minutes < 10 ? (minutes = `0${minutes}`) : (minutes = `${minutes}`);
    seconds < 10 ? (seconds = `0${seconds}`) : (seconds = `${seconds}`);
    return `${hours} : ${minutes} : ${seconds}`;
  }

  return (
    <>
      <div className="waitingBody">
        <div className="waitingMain">
          {user.email}
          <br />
          Your test starts in : {transformTime(remTime)}
          <button onClick={logout}>logout</button>
        </div>
      </div>
    </>
  );
}
