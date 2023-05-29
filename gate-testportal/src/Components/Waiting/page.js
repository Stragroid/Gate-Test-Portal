import "./style.css";
import { useEffect, useState } from "react";

export default function WaitingPage(props) {
  const [remTime, setRemTime] = useState(0);

  useEffect(() => {
    fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata").then((data) => {
      data.json().then((data) => {
        let currTime = new Date(data.datetime).getTime();
        const rem = new Date(props.testTime).getTime() - currTime;
        setRemTime(rem);
      });
    });
  }, []);

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
          Your test starts in : {transformTime(remTime)}
        </div>
      </div>
    </>
  );
}
