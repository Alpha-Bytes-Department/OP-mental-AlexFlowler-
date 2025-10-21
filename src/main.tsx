import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import Router from "./Route/Router.tsx";
import { RouterProvider } from "react-router";
import { AxiosProvider } from "./Providers/AxiosProvider.tsx";
import { AuthProvider } from "./Providers/AuthProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StatusProvider } from "./Providers/StatusProvider.tsx";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID!}>
      <AxiosProvider>
        <AuthProvider>
          <StatusProvider>
            <RouterProvider router={Router} />
          </StatusProvider>
        </AuthProvider>
      </AxiosProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
