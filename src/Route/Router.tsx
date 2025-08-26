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
import MindsetMantra from "../Pages/MindsetMantra/MindsetMantra";
import Journal from "../Pages/Journal/Journal";
import InternalChallenges from "../Pages/InternalChallenges/InternalChallenges";

const Router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home/>,
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
      element: <ChatLayout />,
      errorElement: <Error />,
      children:[
        {
          path: "/chat/general",
          element: <ChatHome />,
        },
        {
          path: "/chat/general/test",
          element: <ChatSession  />,
        },
        {
          path: "/chat/settings",
          element: <Settings />,
        },
        {
          path: "/chat/mindset",
          element: <MindsetMantra/>
        },
        {
          path: "/chat/journal",
          element: <Journal/>
        },
        {
          path: "/chat/internal-challenge",
          element: <InternalChallenges/>
        }
      ]
    }

  ],
  
);
=======
import PrivateRoute from "../Pages/Chat/PrivateRoute";
import UserVerify from "../Pages/MailVerifiy/UserVerify";

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
        path: "/users/verify",
        element: <UserVerify />,
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
        path: "/chat",
        element: <ChatHome />,
      },
      {
        path: "/chat/:id",
        element: <ChatSession />,
      },
      {
        path: "/chat/settings",
        element: <Settings />,
      },
    ],
  },
]);

export default Router;
