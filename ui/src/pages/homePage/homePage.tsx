// homePage.tsx
import IconBox from "@/components/icon-box";
import StatsBox from "@/components/stats-box";
import { Link } from "react-router-dom";
import { NewForYouCarousel } from "./components/newForYouCarousel";
import { MostPopularCarousel } from "./components/mostPopularCarousel";
import { RecentlyReviewed } from "./components/recentlyReviewed";
import { TrendingCarousel } from "./components/trendingCarousel";
import { CalendarPlus, MessageCircleHeart, Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="order-2 flex flex-col justify-center gap-3 sm:order-1">
              <h1 className="font-extrabold">
                Welcome back,{" "}
                <span className="font-bold text-purple">{user.username}</span>
                ! <br /> Here's what's new for you.
              </h1>
            </section>
            <section className="order-1 flex h-full w-full flex-col justify-center gap-3 sm:order-2">
              <StatsBox userId={user.id} />
            </section>
          </div>
          <section className="flex w-full flex-col justify-start gap-3">
            <div className="flex flex-row space-x-4">
              <CalendarPlus />
              <h4 className="uppercase">New for you...</h4>
            </div>
            <section className="h-full">
              <NewForYouCarousel />
            </section>
          </section>
          <section className="flex w-full flex-col justify-start gap-3">
            <div className="flex flex-row space-x-4">
              <Sparkles />
              <h4 className="uppercase">All time most popular...</h4>
            </div>
            <section className="h-full">
              <MostPopularCarousel
                slidesPerViewMobile={4}
                slidesPerViewDesktop={7}
                spaceBetweenMobile={8}
                spaceBetweenDesktop={16}
              />
            </section>
          </section>
          <section className="flex w-full flex-col justify-start gap-3">
            <div className="flex flex-row space-x-4">
              <MessageCircleHeart />
              <h4 className="uppercase">Recently Reviewed...</h4>
            </div>
            <RecentlyReviewed />
          </section>
        </>
      ) : (
        <>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="order-2 flex flex-col gap-3 sm:order-1">
              <h1 className="font-extrabold leading-[normal]">
                Track What You Love, Discover What's Next.
              </h1>
              <h4>
                From your favorite classics to the latest hits, find it all in
                one place.
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
            <section className="order-1 h-full sm:order-2">
              <MostPopularCarousel />
            </section>
          </div>
          <section className="flex w-full flex-col justify-start gap-3">
            <h4 className="uppercase">Discover on Archivr...</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            <h4 className="uppercase">Recently Reviewed...</h4>
            <RecentlyReviewed />
          </section>
          <section className="flex w-full flex-col justify-start gap-3">
            <h3>
              Explore trending hits and hidden gems in movies, shows, music, and
              more - just for you!
            </h3>
            <h4>
              Check out top-rated picks from this week. Sign up to start
              curating your own!
            </h4>
            <section className="h-full">
              <TrendingCarousel />
            </section>
            <Link
              to="/login"
              className="flex w-fit items-center justify-center rounded-full bg-purple px-6 py-2 text-white transition-colors hover:bg-purple/75"
            >
              Sign Up to Discover More
            </Link>
          </section>
        </>
      )}
    </>
  );
}
