import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { Index } from "./page/Index.jsx";
import CommunityWrite from "./page/community/CommunityWrite.jsx";
import CommunityView from "./page/community/CommunityView.jsx";
import CommunityList from "./page/community/CommunityList.jsx";
import CommunityEdit from "./page/community/CommunityEdit.jsx"; // import reactLogo from './assets/react.svg'
import MemberSignup from "./page/member/MemberSignup.jsx";
import MemberLogin from "./page/member/MemberLogin.jsx";
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

import AuthenticationProvider from "./components/context/AuthenticationProvider.jsx";
import React from "react";

import MyPage from "./page/member/MyPage.jsx";
import InquiryAdd from "./page/cs/inquiry/InquiryAdd.jsx";
import InquiryList from "./page/cs/inquiry/InquiryList.jsx";
import InquiryView from "./page/cs/inquiry/InquiryView.jsx";
import InquiryEdit from "./page/cs/inquiry/InquiryEdit.jsx";
import CsIndex from "./page/cs/CsIndex.jsx";
import FaqAdd from "./page/cs/faq/FaqAdd.jsx";
import FaqList from "./page/cs/faq/FaqList.jsx";
import FaqEdit from "./page/cs/faq/FaqEdit.jsx";
import FaqView from "./page/cs/faq/FaqView.jsx";
import Payment from "./page/payment/Payment.jsx";
import PaymentComplete from "./page/payment/PaymentComplete.jsx";
import PaymentHistoryAll from "./page/payment/PaymentHistoryAll.jsx";
import AdminPage from "./page/admin/AdminPage.jsx";
import { MemberLoginProcess } from "./page/member/MemberLoginProcess.jsx";
import MemberSignupKakao from "./page/member/MemberSignupKakao.jsx";
import TourMyList from "./page/tour/TourMyList.jsx";
import { CartCombined } from "./page/payment/CartCombined.jsx";
import PaymentHistoryCombined from "./page/payment/PaymentHistoryCombined.jsx";
import NoticeList from "./page/notice/NoticeList.jsx";
import NoticeWrite from "./page/notice/NoticeWrite.jsx";
import NoticeView from "./page/notice/NoticeView.jsx";
import NoticeEdit from "./page/notice/NoticeEdit.jsx";
import Access from "./components/context/Access.jsx";
import MemberList from "./page/admin/MemberList.jsx";
import AdminMemberView from "./page/admin/AdminMemberView.jsx";
import { AdminMemberEdit } from "./page/admin/AdminMemberEdit.jsx";
import MemberInfo from "./page/member/MemberInfo.jsx";
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
        path: "tour/list/:email",
        element: <TourMyList />,
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
        element: <CartCombined />,
      },
      //결제창
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "payment/complete",
        element: <PaymentComplete />,
      },
      {
        path: "payment/history/:email",
        element: <PaymentHistoryCombined />,
      },
      {
        path: "payment/history",
        element: <PaymentHistoryAll />,
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
      {
        path: "notice/list",
        element: <NoticeList />,
      },
      {
        path: "notice/write",
        element: <NoticeWrite />,
      },
      {
        path: "notice/view/:id",
        element: <NoticeView />,
      },
      {
        path: "notice/edit/:id",
        element: <NoticeEdit />,
      },
      // 고객센터
      {
        path: "cs/index",
        element: <CsIndex />,
      },
      // 고객센터 > 자주 묻는 질문
      {
        path: "cs/faq/add",
        element: <FaqAdd />,
      },
      {
        path: "cs/faq/list",
        element: <FaqList />,
      },
      {
        path: "cs/faq/view/:id",
        element: <FaqView />,
      },
      {
        path: "cs/faq/edit/:id",
        element: <FaqEdit />,
      },
      // 고객센터 > 문의 게시판
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
      {
        path: "member/signup/kakao",
        element: <MemberSignupKakao />,
      },
      // 로그인
      {
        path: "member/login",
        element: <MemberLogin />,
      },
      {
        path: "member/login/process",
        element: <MemberLoginProcess />,
      },
      // 회원 관리
      {
        path: "mypage/:email",
        element: <MyPage />,
      },
      {
        path: "mypage/member/:email",
        element: <MemberInfo />,
      },

      // 관리자
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "member/list",
        element: <MemberList />,
      },
      {
        path: "member/:email",
        element: <AdminMemberView />,
      },
      {
        path: "member/edit/:email",
        element: <AdminMemberEdit />,
      },
      // 접근 제한
      {
        path: "access/denied",
        element: <Access />,
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
