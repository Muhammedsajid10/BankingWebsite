import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import AdminPage from './Pages/AdminPage';
import TransactionPage from './Pages/TransactionPage';
import { AuthProvider, useAuth } from './Contexts/AuthContext';

const ProtectedRoute = ({ element, condition, redirectTo }) => {
  return condition ? element : <Navigate to={redirectTo} />;
};

const App = () => {
  const { user } = useAuth();

  return (
    // <AuthProvider>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={<DashboardPage />}
                condition={user}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminPage />}
                condition={user && user.isAdmin}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute
                element={<TransactionPage />}
                condition={user}
                redirectTo="/login"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
    // </AuthProvider>
  );
};

export default App;
