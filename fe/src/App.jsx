import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { Index } from "./page/Index.jsx";
import CommunityWrite from "./page/community/CommunityWrite.jsx";
import CommunityView from "./page/community/CommunityView.jsx";
import CommunityList from "./page/community/CommunityList.jsx";
import CommunityEdit from "./page/community/CommunityEdit.jsx"; // import reactLogo from './assets/react.svg'
import MemberList from "./page/member/MemberList.jsx";
import MemberSignup from "./page/member/MemberSignup.jsx";
import MemberInfo from "./page/member/MemberInfo.jsx";
import MemberLogin from "./page/member/MemberLogin.jsx";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { TourAdd } from "./page/tour/TourAdd.jsx";
import TourList from "./page/tour/TourList.jsx";
import TourView from "./page/tour/TourView.jsx";
import TourUpdate from "./page/tour/TourUpdate.jsx";
import PlanAdd from "./page/plan/PlanAdd.jsx";
import PlanList from "./page/plan/PlanList.jsx";
import PlanView from "./page/plan/PlanView.jsx";
import PlanEdit from "./page/plan/PlanEdit.jsx";
import WalletAdd from "./page/wallet/WalletAdd.jsx";
import WalletList from "./page/wallet/WalletList.jsx";
import WalletEdit from "./page/wallet/WalletEdit.jsx";
import CartList from "./page/tour/CartList.jsx";
import AuthenticationProvider from "./components/context/AuthenticationProvider.jsx";
import React from "react";
import Payment from "./page/tour/payment.jsx";
import MyPage from "./page/member/MyPage.jsx";
import InquiryAdd from "./page/cs/inquiry/InquiryAdd.jsx";
import InquiryList from "./page/cs/inquiry/InquiryList.jsx";
import InquiryView from "./page/cs/inquiry/InquiryView.jsx";
import InquiryEdit from "./page/cs/inquiry/InquiryEdit.jsx";
import CsIndex from "./page/cs/CsIndex.jsx";
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
      // 내 여행
      {
        path: "plan/add",
        element: <PlanAdd />,
      },
      {
        path: "plan/list",
        element: <PlanList />,
      },
      {
        path: "plan/view/:id",
        element: <PlanView />,
      },
      {
        path: "plan/edit/:id",
        element: <PlanEdit />,
      },
      // 내 지갑
      {
        path: "wallet/add",
        element: <WalletAdd />,
      },
      {
        path: "wallet/list",
        element: <WalletList />,
      },
      {
        path: "wallet/view/:id",
        element: <WalletEdit />,
      },
      {
        path: "wallet/update",
        element: <WalletEdit />,
      },
      // 여행 상품
      {
        path: "tour/list",
        element: <TourList />,
      },
      {
        path: "tour/add",
        element: <TourAdd />,
      },
      {
        path: "tour/view/:id",
        element: <TourView />,
      },
      {
        path: "tour/update/:id",
        element: <TourUpdate />,
      },
      //장바구니
      {
        path: "cart",
        element: <CartList />,
      },
      //결제창
      {
        path: "payment",
        element: <Payment />,
      },
      // 커뮤니티
      {
        path: "community/write",
        element: <CommunityWrite />,
      },
      {
        path: "community/view/:id",
        element: <CommunityView />,
      },
      {
        path: "community/list",
        element: <CommunityList />,
      },
      {
        path: "community/edit/:id",
        element: <CommunityEdit />,
      },
      // 고객센터
      {
        path: "cs/index",
        element: <CsIndex />,
      },
      {
        path: "cs/inquiry/add",
        element: <InquiryAdd />,
      },
      {
        path: "cs/inquiry/list",
        element: <InquiryList />,
      },
      {
        path: "cs/inquiry/view/:id",
        element: <InquiryView />,
      },
      {
        path: "cs/inquiry/edit/:id",
        element: <InquiryEdit />,
      },
      // 회원 가입
      {
        path: "member/signup",
        element: <MemberSignup />,
      },
      // 로그인
      {
        path: "member/login",
        element: <MemberLogin />,
      },
      // 회원 관리
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

      {
        path: "mypage/:email",
        element: <MyPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthenticationProvider>
      <RouterProvider router={router} />
    </AuthenticationProvider>
  );
}

export default App;
