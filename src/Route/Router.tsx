import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Signup from "../Pages/SignUp/Signup";
import ChatHome from "../Pages/Chat/ChatHome/ChatHome";
import ChatLayout from "../Pages/Chat/ChatLayout/ChatLayout";
import ChatSession from "../Pages/Chat/ChatSession/ChatSession";
import Settings from "../Pages/Chat/Settings/Settings";
import Verify from "../Pages/MailVerifiy/Verify";
import JournalOptions from "../Pages/Journal/JournalOptions/JournalOptions";
import JournalChat from "../Pages/Journal/JournalChat/JournalChat";
import JournalList from "../Pages/Journal/JournalList/JournalList";
import MindsetHome from "../Pages/MindsetMantra/MindsetHome/MindsetHome";
import MindsetChat from "../Pages/MindsetMantra/MindsetChat/MindsetChat";
import InternalHome from "../Pages/InternalChallenges/InternalHome/InternalHome";
import InternalChat from "../Pages/InternalChallenges/InternalChat/InternalChat";
import Payment from "../Pages/Payment/Payment";
import PrivateRoute from "../Pages/Chat/PrivateRoute";
// import UserVerify from "../Pages/MailVerifiy/UserVerify";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/verify",
        element: <Verify />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/chat",
    element: (
      <PrivateRoute>
      <ChatLayout />
      </PrivateRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "/chat/general",
        element: <ChatHome />,
      },
      {
        path: "/chat/general/test",
        element: <ChatSession />,
      },
      {
        path: "/chat/settings",
        element: <Settings />,
      },
      {
        path: "/chat/journal/options",
        element: <JournalOptions />,
      },
      {
        path: "/chat/journal/journal-chat",
        element: <JournalChat />,
      },
      {
        path: "/chat/journal/list",
        element: <JournalList />,
      },
      {
        path: "/chat/mindsetHome",
        element: <MindsetHome />,
      },
      {
        path: "/chat/mindsetChat",
        element: <MindsetChat />,
      },
      {
        path: "/chat/internalChat/Home",
        element: <InternalHome />,
      },
      {
        path: "/chat/internalChat/:session_id",
        element: <InternalChat />,
      },
    ],
  },
  {
    path: "/payment/success",
    element: <Payment />,
  },
]);



export default Router;
