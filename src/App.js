import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Signin from "./Components/Signin/page";
// import AdminLogin from "./Components/adminLogin/page";
import Test from "./Components/Test";
import { useEffect } from "react";

function App() {
  const [user, loading] = useAuthState(auth);

  return <>{loading ? <></> : !user ? <Signin /> : <Test />}</>;
}

export default App;
