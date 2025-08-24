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
          path: "/chat/general/:id",
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
        }
      ]
    }

  ],
  
);
export default Router;
