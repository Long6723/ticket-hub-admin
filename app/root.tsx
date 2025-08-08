import { isRouteErrorResponse, Outlet } from "react-router";
import React from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { ConfigProvider } from "antd";

export default function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            activeBorderColor: "none", // màu khi focus
            hoverBorderColor: "none", // màu khi hover
            activeShadow: "none",
          },
          InputNumber: {
            activeBorderColor: "none",
            hoverBorderColor: "none",
            activeShadow: "none",
          },
          Button: {
            colorPrimary: "#e30713",
            colorPrimaryHover: "#cc0610",
            colorPrimaryActive: "#b0050e",
            colorTextLightSolid: "#fff",
          },
        },
        token: {
          // colorText: "#fff",
          colorPrimary: "#e30713",
          borderRadius: 20,
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
