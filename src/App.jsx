import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import { auth, db, doc, getDoc, onAuthStateChanged } from "./config/index";
import { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import { Spin } from "antd";

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const document = await getDoc(docRef);
        if (document.exists()) {
          setUserAuthenticated(true);
        }
      } else {
        setUserAuthenticated(false);
      }
      setLoading(false);
    });
  }, []);

  return loading ? (
    <div className="bg-blue-950	h-screen w-full flex justify-center items-center">
      <Spin spinning={setLoading} size="large" fullscreen />
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
            userAuthenticated ? (
              <Navigate to={"/chat"} />
            ) : (
              <SigninPage />
            )
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
