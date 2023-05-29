import { db } from "../firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import MainTest from "./MainTest";
import WaitingPage from "./Waiting/page";
import NoTestPage from "./NoTest/page";

export default function Test() {
  const [time, setTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isNoTest, setIsNoTest] = useState("notest");

  useEffect(() => {
    fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
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
  }, []);

  return (
    <>
      {isNoTest === "notest" ? (
        <NoTestPage />
      ) : new Date(startTime).getTime() - new Date(time).getTime() <= 0 ? (
        <MainTest />
      ) : (
        <WaitingPage testTime={startTime} />
      )}
    </>
  );
}
