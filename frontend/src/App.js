import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer.jsx";
import { ToastContainer } from "react-toastify";
import Header from "./components/header/Header.jsx";
import Login from "./pages/forms/Login.jsx";
import Register from "./pages/forms/Register.jsx";
import { useSelector } from "react-redux";
import EmailDetails from "./pages/email-details/EmailDetails.jsx";
import CreateEmail from "./components/create-email/CreateEmail.jsx";
import { useState } from "react";
import Profile from "./pages/profile/Profile.jsx";
import NotFound from "./pages/notFound/NotFound";
function App() {
  const { user } = useSelector((state) => state.auth);
  const [status, setStatus] = useState("inbox");
  return (
    <BrowserRouter>
      <ToastContainer theme="colored" position="top-center" />
      <Header status={status} setStatus={setStatus} />
      <Routes>
        <Route
          path="/"
          element={user ? <Home status={status} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="create-email"
          element={user ? <CreateEmail /> : <Navigate to="/login" />}
        />
        <Route
          path="/emails/:id"
          element={!user ? <Login /> : <EmailDetails />}
        />
        <Route
          path="/emails/status/:status2"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
