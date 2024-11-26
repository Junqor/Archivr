// ErrorPage.tsx
// Error page for handling 404, 403, 500, and 503 errors.
import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

// Define the error object interface
interface RouteError {
  status?: number;
}

export default function ErrorPage() {
  // Get the error object from the route
  const error = useRouteError() as RouteError;
  console.error(error);

  // Set the error message based on the error status
  const errorMessageHeader = {
    403: "Forbidden",
    404: "Error",
    500: "Internal Server Error",
    503: "Service Unavailable",
  }[error.status ?? 404];

  const errorMessageSubheader = {
    403: "You Shall Not Pass!",
    404: "Your Media is in Another Castle",
    500: "Something Went Wrong on Our End",
    503: "We're Temporarily Offline",
  }[error.status ?? 404];

  const errorMessage = {
    403: "It looks like you're trying to access something off-limits. This page is restricted, but there's still plenty more to explore in our world of movies, games, music, and more.",
    404: "Uh-oh! You took a wrong turn. This page isn't here. Don't worry, there's plenty more to explore in our world of movies, games, music, and more. Let's get you back on track!",
    500: "Uh-oh! Looks like something went sideways on our end. But don't worry; we're on it. Please give us a moment to fix this.",
    503: "Oops! We're doing a bit of maintenance, or we might be handling high traffic. Either way, we'll be back up shortly!",
  }[error.status ?? 404];

  return (
    <main className="flex flex-col items-center justify-center w-full h-screen gap-2 text-white bg-black">
      <section className="flex flex-col items-center justify-center max-w-screen-sm gap-1">
        <section className="flex flex-col items-center justify-center gap-2">
          <h1 className="font-bold">
            {error.status}{" "}
            <span className="text-purple">{errorMessageHeader}</span>
          </h1>
          <h2>{errorMessageSubheader}</h2>
          <p>
            <i>{errorMessage}</i>
          </p>
        </section>
        <section className="flex flex-col items-center justify-center gap-2">
          <h2>Here's what you can do</h2>
        </section>
        <section className="flex flex-col items-center justify-center gap-2">
          <p>
            Or, if you're up for a surprise, let us send you a{" "}
            <span className="font-bold">Random Recommendation</span>! Who knows,
            it might be your next favorite.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <p>
              <Link
                to="/random"
                className="transition-colors hover:text-purple"
              >
                Random Recommendation
              </Link>
            </p>
            <p>|</p>
            <p>
              <Link
                to="/report-missing-content"
                className="transition-colors hover:text-purple"
              >
                Report Missing Content
              </Link>
            </p>
          </div>
        </section>
      </section>
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </main>
  );
}
