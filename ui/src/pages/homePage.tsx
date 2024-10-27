import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  TrendingUp,
  Heart,
  Star,
  Sparkles,
  Eye,
  MessageCircle,
} from "lucide-react";

export const HomePage = () => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-y-auto font-normal bg-black">
      <Header />
      <div className="max-w-[960px] w-full mx-auto mt-5 flex flex-col items-center justify-start">
        <div className="flex flex-col w-full gap-5">
          {/* Top section */}
          <article className="flex flex-row items-start w-full max-w-full gap-5">
            <div className="flex flex-col w-full h-full gap-3 py-2 md:w-1/2">
              <h1 className="w-full font-[800] leading-[normal]">
                Track What You Love, <br />
                Discover what's next{" "}
              </h1>
              <h4 className="">
                {" "}
                From your favorite classics to the latest hits, find it all in
                one place{" "}
              </h4>
              <div className="flex flex-row items-start gap-3">
                <Button className="hover:bg-purple/80 ">
                  Join the Community
                </Button>
                <Button className="bg-transparent outline outline-white outline-1 hover:bg-white hover:text-black">
                  View the Collection
                </Button>
              </div>
            </div>
            {/* Posters */}
            <div className="flex-row hidden w-1/2 h-[210px] gap-6 overflow-hidden md:flex">
              <img
                src="src/assets/posters/barbie.jpeg"
                className="object-scale-down h-full"
              />
              <img
                src="src/assets/posters/agatha.jpeg"
                className="object-scale-down h-full"
              />
              <img
                src="src/assets/posters/MandM.jpg"
                className="object-scale-down h-full"
              />
            </div>
          </article>
          {/* Discover section */}
          <article className="flex flex-col items-start gap-3">
            <p>DISCOVER ON ARCHIVR...</p>
            <div className="grid w-full grid-cols-3 grid-rows-2 gap-3">
              <Button
                size="home"
                className="flex flex-row justify-start"
                variant={"home"}
              >
                <TrendingUp className="size-20" />
                <p className="text-left text-wrap">
                  Discover what's popular with real-time trending media across
                  movies, shows, and more.
                </p>
              </Button>
              <Button
                size="home"
                className="flex flex-row justify-start"
                variant={"home"}
              >
                <Heart className="size-20" fill="white" />
                <p className="text-left text-wrap">
                  Like media to boost its popularity and see how your taste
                  impacts the trends.
                </p>
              </Button>
              <Button
                size="home"
                variant={"home"}
                className="flex flex-row justify-start"
              >
                <Star className="size-20" fill="white" />
                <p className="text-left text-wrap">
                  Share your thoughts! Rate and review your favorite movies, TV
                  shows, and books.
                </p>
              </Button>
              <Button
                size="home"
                variant={"home"}
                className="flex flex-row justify-start "
              >
                <Eye className="size-20" />
                <p className="text-left text-wrap">
                  Browse by category - movies, TV shows, books, and more - all
                  in one place.
                </p>
              </Button>
              <Button
                size="home"
                variant={"home"}
                className="flex flex-row justify-start "
              >
                <Sparkles className="size-20" fill="white" />
                <p className="text-left text-wrap">
                  Receive tailored suggestions based on what you like and rate.
                </p>
              </Button>
              <Button
                size="home"
                variant={"home"}
                className="flex flex-row justify-start"
              >
                <MessageCircle className="size-20" fill="white" />
                <p className="text-left text-wrap">
                  Engage with the community by reading and leaving reviews on
                  your favorite content.
                </p>
              </Button>
            </div>
          </article>
          {/* Recently viewed section */}
          <article className="flex flex-col items-start justify-center gap-3">
            <p>RECENTLY VIEWED...</p>
            <div className="flex flex-row items-start w-full gap-3 overflow-hidden overflow-x-auto max-h-28 no-scrollbar">
              {["barbie.jpeg", "agatha.jpeg", "MandM.jpg", "terrifier.jpg"].map(
                (poster) => (
                  <img
                    key={crypto.randomUUID()}
                    src={`src/assets/posters/${poster}`}
                    className="object-scale-down h-full"
                  />
                )
              )}
              {["barbie.jpeg", "agatha.jpeg", "MandM.jpg", "terrifier.jpg"].map(
                (poster) => (
                  <img
                    key={crypto.randomUUID()}
                    src={`src/assets/posters/${poster}`}
                    className="object-scale-down h-full"
                  />
                )
              )}
              {["barbie.jpeg", "agatha.jpeg", "MandM.jpg", "terrifier.jpg"].map(
                (poster) => (
                  <img
                    key={crypto.randomUUID()}
                    src={`src/assets/posters/${poster}`}
                    className="object-scale-down h-full"
                  />
                )
              )}
              {["barbie.jpeg", "agatha.jpeg", "MandM.jpg", "terrifier.jpg"].map(
                (poster) => (
                  <img
                    key={crypto.randomUUID()}
                    src={`src/assets/posters/${poster}`}
                    className="object-scale-down h-full"
                  />
                )
              )}
            </div>
          </article>
          {/* Explore section */}
          <article className="flex flex-col items-center justify-center gap-3">
            <h3 className="font-[200] leading-tight text-center">
              {" "}
              Explore trending hits and hidden gems in movies, shows, and books
              - just for you!
            </h3>
            <h4>
              {" "}
              Check out top-rated picks from this week. Sign up to start
              curating your own!
            </h4>
            <div className="flex flex-row items-start w-full gap-3 overflow-hidden overflow-x-auto max-h-52 no-scrollbar">
              {["barbie.jpeg", "agatha.jpeg", "MandM.jpg", "terrifier.jpg"].map(
                (poster) => (
                  <img
                    key={crypto.randomUUID()}
                    src={`src/assets/posters/${poster}`}
                    className="object-scale-down h-full"
                  />
                )
              )}
              {["barbie.jpeg", "agatha.jpeg", "MandM.jpg", "terrifier.jpg"].map(
                (poster) => (
                  <img
                    key={crypto.randomUUID()}
                    src={`src/assets/posters/${poster}`}
                    className="object-scale-down h-full"
                  />
                )
              )}
            </div>
          </article>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
