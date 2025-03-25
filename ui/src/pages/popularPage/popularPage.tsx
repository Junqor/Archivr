import { Separator } from "@/components/ui/separator";
import { Clapperboard, Tv } from "lucide-react";
import { PopularMoviesCarousel } from "./components/popularMoviesCarousel";
import { PopularShowsCarousel } from "./components/popularShowsCarousel";
import { PopularAnimeCarousel } from "./components/popularAnimeCarousel";
import { Link } from "react-router-dom";

export function PopularPage() {
  return (
    <main className="flex h-full w-full flex-col gap-y-5">
      <div className="w-full">
        <section className="flex flex-col items-center justify-center gap-3 md:items-start">
          <h1 className="font-bold">
            Explore
            <span className="bg-gradient-to-br from-blue-600 to-fuchsia-700 bg-clip-text font-extrabold text-transparent">
              {" "}
              Popular{" "}
            </span>
            Media by Category
          </h1>
        </section>
      </div>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row gap-x-4">
          <Clapperboard />
          <h4>Most popular movies</h4>
        </div>
        <Separator />
        <section className="h-full">
          <PopularMoviesCarousel />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex w-full flex-row gap-x-4">
          <Tv />
          <h4>Most popular shows</h4>
        </div>
        <Separator />
        <section className="h-full">
          <PopularShowsCarousel />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center gap-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="16"
            viewBox="0 0 3 2"
          >
            <rect
              width="3"
              height="2"
              fill="white"
              stroke="white"
              strokeWidth="0.1"
            />
            <circle
              cx="1.5"
              cy="1"
              r="0.6"
              fill="red"
              stroke="red"
              strokeWidth="0.1"
            />
          </svg>
          <h4>Most popular anime</h4>
          <Link
            to="/genre/anime"
            className="ml-auto text-white/80 hover:underline"
          >
            View All
          </Link>
        </div>
        <Separator />
        <section className="h-full">
          <PopularAnimeCarousel />
        </section>
      </section>
    </main>
  );
}
