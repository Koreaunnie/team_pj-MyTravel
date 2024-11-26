import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MemberSignup from "./page/member/MemberSignup.jsx";
import { RootLayout } from "./page/root/RootLayout.jsx";
import MemberList from "./page/member/MemberList.jsx";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "member/signup", element: <MemberSignup /> },
      { path: "member/list", element: <MemberList /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
