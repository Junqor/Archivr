// router.tsx
import { LoginPopUp } from "@/pages/login";
import ErrorPage from "@/pages/errorPage";
import HomePage from "@/pages/homePage";
import { Layout } from "@/pages/layout";
import { MediaPage } from "@/pages/mediaPage";
import { createBrowserRouter } from "react-router-dom";

// Define the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      // Home Page
      {
        path: "/",
        element: <HomePage />,
      },
      // Movie Page
      {
        path: "/media/:id",
        element: <MediaPage />,
      },
      // Error Pages
      {
        path: "/forbidden",
        element: <ErrorPage />,
        errorElement: <ErrorPage />,
        loader: () => {
          throw { status: 403 };
        },
      },
      {
        path: "/internal-error",
        element: <ErrorPage />,
        errorElement: <ErrorPage />,
        loader: () => {
          throw { status: 500 };
        },
      },
      {
        path: "/maintenance",
        element: <ErrorPage />,
        errorElement: <ErrorPage />,
        loader: () => {
          throw { status: 503 };
        },
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPopUp />,
  },
]);

export default router;
