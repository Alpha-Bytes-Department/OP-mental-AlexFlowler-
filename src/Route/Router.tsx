import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";

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
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Login />,
    }

  ],
  
);
export default Router;
