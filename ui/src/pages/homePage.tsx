// homePage.tsx
import { useEffect, useState } from "react";
import IconBox from "@/components/icon-box";
import { Link } from "react-router-dom";

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

  return (
    <>
      {isLoggedIn ? (
        <div>
          <section>
            <h1>Welcome to the secret page! You are logged in. 🎉</h1>
          </section>
        </div>
      ) : (
        <>
          <div className="grid w-full grid-cols-2 gap-6">
            <section className="flex flex-col gap-3">
              <h1 className="font-[800] leading-[normal]">
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
            {/* Add trending media carousel */}
          </div>
          <section className="flex flex-col justify-start w-full gap-3">
            <h4 className="uppercase">Discover on Archivr...</h4>
            <div className="grid grid-cols-3 gap-3">
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
            {/* Get the latest reviews */}
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
            {/* Carousel of trending media */}
            {/* CTA to sign up button */}
          </section>
        </>
      )}
    </>
  );
}
