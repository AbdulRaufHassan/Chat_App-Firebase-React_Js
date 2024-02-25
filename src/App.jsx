import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import { auth, onAuthStateChanged } from "./config/index";
import { useState } from "react";
import ChatPage from "./pages/ChatPage";

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
    }
    setLoading(false);
  });

  return loading ? (
    <div className="bg-blue-950	h-screen w-full flex justify-center items-center">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userAuthenticated ? <Navigate to={"/chat"} /> : <SignupPage />
          }
        />
        <Route
          path="/signin"
          element={
            userAuthenticated ? <Navigate to={"/chat"} /> : <SigninPage />
          }
        />
        <Route
          path="/chat"
          element={
            userAuthenticated ? <ChatPage /> : <Navigate to={"/signin"} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
