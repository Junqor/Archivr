import ErrorPage from "@/pages/errorPage";
import { HomePage } from "@/pages/homePage";
import { Layout } from "@/pages/layout";
import { MediaPage } from "@/pages/mediaPage";
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
        path: "/media/:id",
        element: <MediaPage />,
      },
    ],
  },
]);

export default router;
