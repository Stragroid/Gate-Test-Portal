import { useEffect, useState } from "react";

export default function BeforeTest(props) {
  let currTime = 0;
  const [remTime, setRemTime] = useState(0);

  useEffect(() => {
    fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata").then((data) => {
      data.json().then((data) => {
        currTime = new Date(data.datetime).getTime();
      });
    });
    const rem = new Date(props.testTime).getTime() - currTime;
    setRemTime(rem);
  }, []);

  function transformTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time - hours * 3600000) / 60000);
    const seconds = Math.floor(
      (time - hours * 3600000 - minutes * 60000) / 1000
    );
    return `${hours} : ${minutes} : ${seconds}`;
  }

  setInterval(() => {
    const rem = new Date(props.testTime).getTime() - currTime;
    setRemTime(rem);
  }, 1000);

  return (
    <>
      <h1>Test Start Time: {props.testTime}</h1>
      <h1>Remaining Time: {transformTime(remTime)}</h1>
    </>
  );
}
