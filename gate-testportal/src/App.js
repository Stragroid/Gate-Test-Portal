import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Signin from "./Components/Signin";
import Test from "./Components/Test";

function App() {
  const [user, loading] = useAuthState(auth);
  return <>{loading ? <></> : !user ? <Signin /> : <Test />}</>;
}

export default App;
