// router.tsx
import { Login } from "@/pages/login";
import ErrorPage from "@/pages/errorPage";
import HomePage from "@/pages/homePage/homePage";
import GenrePage from "@/pages/genrePage/genrePage";
import { Layout } from "@/pages/_layout/layout";
import { MediaPage } from "@/pages/mediaPage/mediaPage";
import { createBrowserRouter } from "react-router-dom";
import AdminPortal from "@/pages/adminPortal/adminPortal";
import { UnderConstruction } from "@/pages/underConstruction";
import ProtectedRoute from "@/components/protectedRoute";
import { PopularPage } from "@/pages/popularPage/popularPage";

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
      // Genre Page
      {
        path: "/genre/:genre",
        element: <GenrePage />,
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
        element: (
          <ProtectedRoute>
            <AdminPortal />
          </ProtectedRoute>
        ),
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
        element: <PopularPage />,
      },
      {
        path: "/members",
        element: <UnderConstruction />,
      },
      {
        path: "/random",
        element: <UnderConstruction />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
