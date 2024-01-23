import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { AppContextProvider } from "./components/context/AppContext";
import Home from "./components/pages/home/Home";
import Login from "./components/pages/login/Login";
import SignUp from "./components/pages/signup/SignUp";
import "./index.css";
import AuthorizationRoute from "./components/common/auth-route/AuthorizationRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "home", element: <Home /> },
      {
        path: "signup",
        element: (
          <AuthorizationRoute>
            <SignUp />
          </AuthorizationRoute>
        ),
      },
      {
        path: "login",
        element: (
          <AuthorizationRoute>
            <Login />
          </AuthorizationRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>
);
