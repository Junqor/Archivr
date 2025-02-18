import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import { PopularMoviesCarousel } from "./components/popularMoviesCarousel";
import { PopularShowsCarousel } from "./components/popularShowsCarousel";
import { PopularAnimeCarousel } from "./components/popularAnimeCarousel";

export function PopularPage() {
  return (
    <main className="flex h-full w-full flex-col">
      <div className="w-full">
        <section className="flex flex-col items-center justify-center gap-3 md:items-start">
          <h1 className="font-bold">
            Explore
            <span className="bg-gradient-to-br from-blue-600 to-fuchsia-700 bg-clip-text font-extrabold text-transparent">
              {" "}
              Popular{" "}
            </span>
            Media by Category.
          </h1>
        </section>
      </div>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row space-x-4">
          <Sparkles />
          <h4 className="uppercase">Most popular movies</h4>
        </div>
        <Separator />
        <section className="h-full">
          <PopularMoviesCarousel />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row space-x-4">
          <Sparkles />
          <h4 className="uppercase">Most popular shows</h4>
        </div>
        <Separator />
        <section className="h-full">
          <PopularShowsCarousel />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row space-x-4">
          <Sparkles />
          <h4 className="uppercase">Most popular anime</h4>
        </div>
        <Separator />
        <section className="h-full">
          <PopularAnimeCarousel />
        </section>
      </section>
    </main>
  );
}
