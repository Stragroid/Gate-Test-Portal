import { useEffect, useState } from "react";
import MainTest from "./MainTest";
import WaitingPage from "./Waiting/page";
import NoTestPage from "./NoTest/page";

export default function Test(props) {
  const [time, setTime] = useState(null);
  const [remTime, setRemTime] = useState(null);

  useEffect(() => {
    fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata")
      .then((data) => data.json())
      .then((data) => {
        const date = new Date(data.datetime);
        setTime(date.toString());
        let currTime = new Date(data.datetime).getTime();
        const rem = new Date(props.testTime).getTime() - currTime;
        setRemTime(rem);
      });
  }, []);

  return (
    <>
      {props.isNoTest === "notest" ? (
        <NoTestPage />
      ) : new Date(props.testTime).getTime() - new Date(time).getTime() <= 0 ? (
        <MainTest />
      ) : remTime ? (
        <WaitingPage remTime={remTime} />
      ) : null}
    </>
  );
}
