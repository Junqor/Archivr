// router.tsx
import { LoginPopUp } from "@/pages/login";
import ErrorPage from "@/pages/errorPage";
import HomePage from "@/pages/homePage";
import { Layout } from "@/pages/layout";
import { MediaPage } from "@/pages/mediaPage";
import { createBrowserRouter } from "react-router-dom";
import AdminPortal from "@/pages/admin-portal/adminPortal";
import { UnderConstruction } from "@/pages/underConstruction";

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
      // Admin Portal
      {
        path: "/admin",
        element: <AdminPortal />,
      },
      {
        path: "/profile",
        element: <UnderConstruction />,
      },
      {
        path: "/settings",
        element: <UnderConstruction />,
      },
      {
        path: "/genre",
        element: <UnderConstruction />,
      },
      {
        path: "/trending",
        element: <UnderConstruction />,
      },
      {
        path: "/popular",
        element: <UnderConstruction />,
      },
      {
        path: "/members",
        element: <UnderConstruction />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPopUp />,
  },
]);

export default router;
