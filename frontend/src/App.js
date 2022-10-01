import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DocsList, EditUser, ErrorPage, GroupChat, Login, LoginSuccess, Logout, Register, RegisterSuccess, Share, UsersList, Welcome } from './pages';
import PrivateRoutes from './utils/PrivateRoutes';
import Context from './context/Context';
import { accessTokenChecker } from './utils/utils';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'font-awesome/css/font-awesome.css';
import './styles/app.scss';

function App() {
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(accessTokenChecker("accessToken"));
  }, [token]);

  if (token === undefined) return null;

  return (
    <Context>
      <Routes>
        <Route element={<PrivateRoutes token={token} />}>
          <Route element={<LoginSuccess />} path="/login-success" />
          <Route element={<GroupChat />} path="/group-chat" />
          <Route element={<UsersList />} path="/users-list" />
          <Route element={<EditUser />} path="/edit-user/:id" />
          <Route element={<DocsList />} path="/docs-list" />
          <Route element={<Share />} path="/share/:id" />
        </Route>
        <Route element={<Logout />} path="/logout" />
        <Route element={token ? <Navigate to="/users-list" /> : <Welcome />} path="/" />
        <Route element={token ? <Navigate to="/users-list" /> : <Login />} path="/login" />
        <Route element={token ? <Navigate to="/users-list" /> : <Register />} path="/register" />
        <Route element={token ? <Navigate to="/users-list" /> : <RegisterSuccess />} path="/register-success" />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
      />
    </Context>
  );
}

export default App;
