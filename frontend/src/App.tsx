import { type FC, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import Navbar from "./components/Navbar.js";
import Home from "./components/Home.js";
import People from "./components/People.js";
import Login from "./components/Login.js";

const App: FC = () => {
  const isAuthenticated = useIsAuthenticated();

  // Protected Route wrapper
  const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/people"
          element={
            <ProtectedRoute>
              <People />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
