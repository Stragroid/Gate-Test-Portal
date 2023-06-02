import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import MainTest from "./MainTest";
import WaitingPage from "./Waiting/page";
import NoTestPage from "./NoTest/page";
import Attemped from "./Attempted/page";

export default function Test() {
  const [time, setTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isNoTest, setIsNoTest] = useState("notest");
  const [user, loading] = useAuthState(auth);
  const [isAttempted, setIsAttempted] = useState(true);

  useEffect(() => {
    if (loading) return;
    fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata")
      .then((data) => data.json())
      .then((data) => {
        const date = new Date(data.datetime);
        setTime(date.toString());
      });
    const q = query(collection(db, "test"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.online === true) {
          const date = new Date(data.startTime.seconds * 1000);
          setStartTime(date.toString());
          setIsNoTest(null);
        } else {
          setIsNoTest("notest");
        }
      });
    });
    getDocs(query(collection(db, "students"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === user.email) {
          if (data.attended === true) {
            setIsAttempted(true);
          } else {
            setIsAttempted(false);
          }
        }
      });
    });
  }, []);

  return (
    <>
      {isNoTest === "notest" ? (
        <NoTestPage />
      ) : new Date(startTime).getTime() - new Date(time).getTime() <= 0 ? (
        isAttempted === true ? (
          <Attemped />
        ) : (
          <MainTest />
        )
      ) : (
        <WaitingPage testTime={startTime} />
      )}
    </>
  );
}
