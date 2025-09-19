import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Route/Router.tsx";
import { RouterProvider } from "react-router";
import { AxiosProvider } from "./Providers/AxiosProvider.tsx";
import { AuthProvider } from "./Providers/AuthProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StatusProvider } from "./Providers/StatusProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID!}>
    <AxiosProvider>
      <AuthProvider>
        <StatusProvider>
          <RouterProvider router={Router} />
        </StatusProvider>
      </AuthProvider>
    </AxiosProvider>
  </GoogleOAuthProvider>
);
