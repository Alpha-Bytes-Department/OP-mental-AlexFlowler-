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
import JournalDetails from "../Pages/Journal/JournalDetails/JournalDetails";
import UserVerify from "../Pages/MailVerifiy/UserVerify";
import ChatHistory from "../Pages/Chat/ChatHistory/ChatHistory";
import SingleChat from "../Pages/Chat/SingleChat/SingleChat";
import ChatInit from "../Pages/Chat/ChatInit/ChatInit";

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
      {
        path:"/api/users/pass-reset",
        element:<UserVerify />
      }
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
        path: "init",
        element: <ChatInit/>
      },
      {
        path: ":sessionId",
        element: <ChatHome />,
      },
      {
        path: "general/history",
        element: <ChatHistory />,
      },
      {
        path: "general/history/:session_id",
        element:<SingleChat/>
      },
      {
        path: "general/test",
        element: <ChatSession />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "journal/options",
        element: <JournalOptions />,
      },
      {
        path: "journal/journal-chat/:session_id",
        element: <JournalChat />,
      },
      {
        path: "journal/list",
        element: <JournalList />,
      },
      {
        path: "journal/details/:session_id",
        element: <JournalDetails />,
      },
      {
        path: "mindsetChat/home",
        element: <MindsetHome />,
      },
      {
        path: "mindsetChat/:mindset_session",
        element: <MindsetChat />,
      },
      {
        path: "internalChat/Home",
        element: <InternalHome />,
      },
      {
        path: "internalChat/:session_id",
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
