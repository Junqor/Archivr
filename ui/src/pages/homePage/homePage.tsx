// homePage.tsx
import IconBox from "@/components/icon-box";
import StatsBox from "@/pages/homePage/components/statsBox";
import { Link } from "react-router-dom";
import { SimilarCarousel } from "./components/similarCarousel";
import { RecommendedCarousel } from "./components/recommendedCarousel";
import { MostPopularCarousel } from "./components/mostPopularCarousel";
import { RecentlyReviewed } from "./components/recentlyReviewed";
import { TrendingCarousel } from "./components/trendingCarousel";
import { Info, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth";
import { Separator } from "@/components/ui/separator";
import { TopRatedPicksCarousel } from "./components/topRatedPicksCarousel";
import { QuestionAnswerRounded, TvRounded } from "@mui/icons-material";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function HomePage() {
  const { user } = useAuth();

  return user ? (
    // Logged in Home Screen
    <div className="flex h-full w-full flex-col gap-6">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <section className="flex flex-col items-center justify-center gap-3 md:items-start">
          <h1 className="font-extrabold">
            Welcome back,{" "}
            <span className="font-bold text-purple">{user.username}</span>
            ! <br /> Here's what's new for you.
          </h1>
        </section>
        <section className="order-1 flex h-full w-full flex-col items-center justify-center gap-3 md:order-2">
          <StatsBox userId={user.id} />
        </section>
      </div>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center gap-x-4">
          <TrendingUp />
          <h4>Trending this week...</h4>
          <Link to="trending" className="ml-auto text-white/80 hover:underline">
            See More
          </Link>
        </div>
        <Separator />
        <section className="h-full overflow-visible">
          <TrendingCarousel />
        </section>
      </section>
      <SimilarCarousel />
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center gap-x-4">
          <Sparkles />
          <h4>All time most popular...</h4>
          <Link to="popular" className="ml-auto text-white/80 hover:underline">
            See More
          </Link>
        </div>
        <Separator />
        <section className="h-full">
          <MostPopularCarousel />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center justify-start gap-x-4">
          <TvRounded sx={{ fontSize: "1.71428571rem" }} />
          <h4>We think you'd love these...</h4>
          <Popover>
            <PopoverTrigger className="ml-auto">
              <Info />
            </PopoverTrigger>
            <PopoverContent
              className="inline-flex w-72 border-white text-sm text-white"
              side="top"
              align="end"
            >
              <p>
                Recommendations are based on what you like and rate. Interact
                with more media to get more personalized recommendations.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <Separator />
        <section className="h-full">
          <RecommendedCarousel />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center gap-x-4">
          <QuestionAnswerRounded />
          <h4>Recent Reviews...</h4>
          <Link to="activity" className="ml-auto text-white/80 hover:underline">
            See More
          </Link>
        </div>
        <Separator />
        <RecentlyReviewed />
      </section>
    </div>
  ) : (
    // Not logged in Home Screen
    <>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h1 className="font-extrabold leading-[normal]">
            Track What You Love, Discover What's Next.
          </h1>
          <h4>
            From your favorite classics to the latest hits, find it all in one
            place.
          </h4>
          <div className="flex flex-row gap-3">
            <Link
              to="/login"
              className="flex items-center justify-center rounded-full bg-purple px-6 py-2 text-white transition-colors hover:bg-purple/75"
            >
              Join the Community
            </Link>
            <Link
              to="#"
              className="flex items-center justify-center rounded-full border border-white bg-transparent px-6 py-1 transition-colors hover:bg-white hover:text-black"
            >
              View the Collection
            </Link>
          </div>
        </section>
        <section className="h-full">
          <TrendingCarousel
            slidesPerViewMobile={3}
            slidesPerViewDesktop={3}
            spaceBetweenMobile={16}
            spaceBetweenDesktop={16}
          />
        </section>
      </div>
      <section className="flex w-full flex-col justify-start gap-3">
        <h4 className="uppercase">Discover on Archivr...</h4>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <IconBox
            iconName="TrendingUp"
            description="Discover what's popular with real-time trending media across movies, shows, and more."
          />
          <IconBox
            iconName="Favorite"
            description="Like media to boost its popularity and see how your taste impacts the trends."
          />
          <IconBox
            iconName="Star"
            description="Share your thoughts! Rate and review your favorite movies, TV shows, and books."
          />
          <IconBox
            iconName="Browse"
            description="Browse by category - movies, TV shows, books, and more - all in one place."
          />
          <IconBox
            iconName="Sparkles"
            description="Receive tailored suggestions based on what you like and rate."
          />
          <IconBox
            iconName="Reviews"
            description="Engage with the community by reading and leaving reviews on your favorite content."
          />
        </div>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center space-x-4">
          <QuestionAnswerRounded />
          <h4 className="uppercase">Recently Reviewed...</h4>
        </div>
        <Separator />
        <RecentlyReviewed />
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <h3>
          Explore trending hits and hidden gems in movies, shows, music, and
          more - just for you!
        </h3>
        <Separator />
        <h4>
          Check out top-rated picks from this week. Sign up to start curating
          your own!
        </h4>
        <section className="h-full">
          <TopRatedPicksCarousel />
        </section>
        <Link
          to="/login"
          className="flex w-fit items-center justify-center rounded-full bg-purple px-6 py-2 text-white transition-colors hover:bg-purple/75"
        >
          Sign Up to Discover More
        </Link>
      </section>
    </>
  );
}
