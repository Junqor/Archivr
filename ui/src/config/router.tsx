import ErrorPage from "@/pages/errorPage";
import { HomePage } from "@/pages/homePage";
import { Layout } from "@/pages/layout";
import MovieCard from "@/pages/moviePage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movies/:id",
        element: <MovieCard />,
      },
    ],
  },
]);

export default router;
