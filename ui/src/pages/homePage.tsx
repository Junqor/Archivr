// homePage.tsx
import { useEffect, useState } from "react";
import IconBox from "@/components/icon-box";
import StatsBox from "@/components/stats-box";
import { Link } from "react-router-dom";
import {
  getMostPopular,
  getRecentlyReviewed,
  getTrending,
  getNewForYou,
} from "@/api/media";
import { TMedia } from "@/types/media";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import MediaCarousel from "@/components/MediaCarousel";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("auth") === "true" // Check if user is logged in
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("auth") === "true"); // Update the state
    };

    window.addEventListener("storage", handleStorageChange); // Listen for storage changes
    return () => window.removeEventListener("storage", handleStorageChange); // Remove the listener
  }, []);

  const user = localStorage.getItem("user");

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="flex flex-col gap-3 justify-center order-2 sm:order-1">
              <h1>
                Welcome back,{" "}
                <span className="text-purple font-bold">
                  {user ? JSON.parse(user).username : "User"}
                </span>
                ! <br /> Here's what's new for you.
              </h1>
            </section>
            <section className="h-full w-full flex flex-col gap-3 justify-center order-1 sm:order-2">
              <StatsBox userId={user ? JSON.parse(user).id : 0} />
            </section>
          </div>
          <section className="flex flex-col justify-start w-full gap-3">
            <h4 className="uppercase">New for you...</h4>
            <section className="h-full">
              <NewForYouCarousel />
            </section>
          </section>
          <section className="flex flex-col justify-start w-full gap-3 pb-10">
            <h4 className="uppercase">All time most popular...</h4>
            <section className="h-full">
              <MostPopularCarousel
                slidesPerViewMobile={4}
                slidesPerViewDesktop={7}
                spaceBetweenMobile={8}
                spaceBetweenDesktop={16}
              />
            </section>
          </section>
          <section className="flex flex-col justify-start w-full gap-3">
            <h4 className="uppercase">Recently Reviewed...</h4>
            <RecentlyReviewed />
          </section>
        </>
      ) : (
        <>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="flex flex-col order-2 gap-3 sm:order-1">
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
                  className="flex items-center justify-center px-6 py-2 text-white transition-colors rounded-full bg-purple hover:bg-purple/75"
                >
                  Join the Community
                </Link>
                <Link
                  to="#"
                  className="flex items-center justify-center px-6 py-1 transition-colors bg-transparent border border-white rounded-full hover:bg-white hover:text-black"
                >
                  View the Collection
                </Link>
              </div>
            </section>
            <section className="order-1 h-full sm:order-2">
              <MostPopularCarousel />
            </section>
          </div>
          <section className="flex flex-col justify-start w-full gap-3">
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
          <section className="flex flex-col justify-start w-full gap-3">
            <h4 className="uppercase">Recently Reviewed...</h4>
            <RecentlyReviewed />
          </section>
          <section className="flex flex-col justify-start w-full gap-3">
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
              className="flex items-center justify-center px-6 py-2 text-white transition-colors rounded-full bg-purple hover:bg-purple/75 w-fit"
            >
              Sign Up to Discover More
            </Link>
          </section>
        </>
      )}
    </>
  );
}

function MostPopularCarousel({ ...props }) {
  const [media, setMedia] = useState<TMedia[]>([]);

  useEffect(() => {
    getMostPopular().then((data) => setMedia(data));
  }, []);

  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={3}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}

function RecentlyReviewed() {
  const [media, setMedia] = useState<TMedia[]>([]);

  useEffect(() => {
    getRecentlyReviewed().then((data) => setMedia(data));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {media.map((item) => (
        <ThumbnailPreview key={item.id} media={item} />
      ))}
    </div>
  );
}

function TrendingCarousel({ ...props }) {
  const [media, setMedia] = useState<TMedia[]>([]);

  useEffect(() => {
    getTrending().then((data) => setMedia(data));
  }, []);

  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={4}
      slidesPerViewDesktop={7}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}

function NewForYouCarousel() {
  const [media, setMedia] = useState<TMedia[]>([]);

  const userId = JSON.parse(localStorage.getItem("user") ?? "{}").id;

  useEffect(() => {
    getNewForYou(userId).then((data) => setMedia(data));
  }, []);

  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={4}
      slidesPerViewDesktop={7}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
    />
  );
}
