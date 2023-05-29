import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { initFirebase } from "./firebaseConfig";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from './App';
import Signin from './Components/Signin';

initFirebase();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <App />
      </>
    ),
    errorElement: <Navigate to="/" />,
  },
  {
    path: "/signin",
    element: (
      <>
        <Signin />
      </>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);