import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center w-full h-screen text-white bg-black"
    >
      <h1 className="font-bold text-purple">Oops!</h1>
      <h2>Sorry, an unexpected error has occurred. :(</h2>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button asChild className="my-4">
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  );
}
