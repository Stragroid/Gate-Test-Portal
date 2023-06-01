import { db, auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Signin from "./Components/Signin/page";
// import AdminLogin from "./Components/adminLogin/page";
import Test from "./Components/Test";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

function App() {
  const [startTime, setStartTime] = useState(null);
  const [isNoTest, setIsNoTest] = useState("notest");

  useEffect(() => {
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

  const [user, loading] = useAuthState(auth);
  return (
    <>
      {loading ? (
        <></>
      ) : !user ? (
        <Signin />
      ) : startTime ? (
        <Test isNoTest={isNoTest} testTime={startTime} />
      ) : null}
    </>
  );
}

export default App;
