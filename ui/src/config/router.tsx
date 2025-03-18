// router.tsx
import { Login } from "@/pages/login";
import ErrorPage from "@/pages/errorPage";
import HomePage from "@/pages/homePage/homePage";
import GenrePage from "@/pages/genrePage/genrePage";
import BrowsePage from "@/pages/browsePage/browsePage";
import { Layout } from "@/pages/_layout/layout";
import { MediaPage } from "@/pages/mediaPage/mediaPage";
import { createBrowserRouter } from "react-router-dom";
import AdminPortal from "@/pages/adminPortal/adminPortal";
import { UnderConstruction } from "@/pages/underConstruction";
import ProtectedRoute from "@/components/protectedRoute";
import { ProfileSettings } from "@/pages/settingsPage/settingsPage";
import LoginRequiredRoute from "@/components/loginRequiredRoute";
import ProfilePage from "@/pages/profilePage/profilePage";
import { PopularPage } from "@/pages/popularPage/popularPage";
import TermsOfServicePage from "@/pages/termsOfService";
import { TrendingPage } from "@/pages/trendingPage/trendingPage";
import { TrendingPagePaginated } from "@/pages/trendingPage/trendingPagePaginated";
import { ResetPassword } from "@/pages/resetPassword";
import { Random } from "@/pages/random";
import { ActivityPage } from "@/pages/activityPage/activityPage";
import { GenresList } from "@/pages/genrePage/genresList";

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
      {
        path: "/activity",
        element: <ActivityPage />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminPortal />
          </ProtectedRoute>
        ),
      },
      //Browse Page
      {
        path: "/browse",
        element: <BrowsePage />,
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
        path: "/genre",
        element: <GenresList />,
      },
      {
        path: "/genre/:genre",
        element: <GenrePage />,
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
      {
        path: "/media/:id",
        element: <MediaPage />,
      },
      {
        path: "/members",
        element: <UnderConstruction />,
      },
      {
        path: "/popular",
        element: <PopularPage />,
      },
      {
        path: "/privacy",
        element: <UnderConstruction />,
      },
      {
        path: "/profile/:username",
        element: <ProfilePage />,
      },
      {
        path: "/random",
        element: <Random />,
      },
      {
        path: "/search",
        element: <UnderConstruction />,
      },
      {
        path: "/settings",
        element: (
          <LoginRequiredRoute>
            <ProfileSettings />
          </LoginRequiredRoute>
        ),
      },
      {
        path: "/tos",
        element: <TermsOfServicePage />,
      },
      {
        path: "/trending",
        element: <TrendingPage />,
      },
      {
        path: "/trending/movies",
        element: <TrendingPagePaginated type="movie" />,
      },
      {
        path: "/trending/shows",
        element: <TrendingPagePaginated type="tv" />,
      },
    ],
  },
  {
    path: "/password-reset",
    element: <ResetPassword />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
