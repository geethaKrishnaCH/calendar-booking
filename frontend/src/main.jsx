import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { AppContextProvider } from "./components/context/AppContext";
import AuthorizationRoute from "./components/guards/auth-route/AuthorizationRoute";
import ProtectedRoute from "./components/guards/protected-route/ProtectedRoute";
import AddBooking from "./components/pages/bookings/add-booking/AddBooking";
import MyBookings from "./components/pages/bookings/my-bookings/MyBookings";
import Home from "./components/pages/home/Home";
import Login from "./components/pages/login/Login";
import SignUp from "./components/pages/signup/SignUp";
import "./index.css";
import UserBookings from "./components/pages/bookings/user-bookings/UserBookings";

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
        path: "user/bookings",
        element: (
          <ProtectedRoute>
            <UserBookings />
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
