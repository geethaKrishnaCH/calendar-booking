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
import ProtectedRoute from "./components/common/protected-route/ProtectedRoute";
import MyBookings from "./components/pages/bookings/my-bookings/MyBookings";
import AddBooking from "./components/pages/bookings/add-booking/AddBooking";

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
      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookings/add",
        element: (
          <ProtectedRoute>
            <AddBooking />
          </ProtectedRoute>
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
