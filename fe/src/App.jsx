import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { Index } from "./page/Index.jsx";
import PlanAdd from "./page/plan/PlanAdd.jsx";
import MemberList from "./page/member/MemberList.jsx";
import MemberSignup from "./page/member/MemberSignup.jsx";
import MemberInfo from "./page/member/MemberInfo.jsx";
import MemberLogin from "./page/member/MemberLogin.jsx";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { TourAdd } from "./page/tour/TourAdd.jsx";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// axios 인터셉터 설정
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// react router 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // 메인 화면
      {
        index: true,
        element: <Index />,
      },
      {
        path: "plan/add",
        element: <PlanAdd />,
      },
      {
        path: "tour/list",
        element: <TourList />,
      },
      {
        path: "tour/add",
        element: <TourAdd />,
      },
      {
        path: "member/signup",
        element: <MemberSignup />,
      },
      {
        path: "member/login",
        element: <MemberLogin />,
      },
      {
        path: "member/list",
        element: <MemberList />,
      },
      {
        path: "member/:email",
        element: <MemberInfo />,
      },
      {
        path: "member/edit/:email",
        element: <MemberEdit />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
