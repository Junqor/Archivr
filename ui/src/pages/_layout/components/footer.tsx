import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto flex h-auto w-full flex-row items-start justify-center gap-10 bg-gray-secondary/20 p-3 py-8 text-white outline outline-gray-secondary/50 sm:gap-20 lg:gap-40">
      <section className="flex flex-col gap-2">
        <h4 className="font-bold">QUICK LINKS</h4>
        <Link to="/" className="text-white transition-colors hover:text-purple">
          Home
        </Link>
        <Link
          to="/trending"
          className="text-white transition-colors hover:text-purple"
        >
          Trending
        </Link>
        <Link
          to="/popular"
          className="text-white transition-colors hover:text-purple"
        >
          Popular
        </Link>
        <Link
          to="/members"
          className="text-white transition-colors hover:text-purple"
        >
          Members
        </Link>
      </section>
      <section className="flex flex-col gap-2">
        <h4 className="font-bold">LEGAL & PRIVACY</h4>
        <Link
          to="/privacy"
          className="text-white transition-colors hover:text-purple"
        >
          Privacy Policy
        </Link>
        <Link
          to="/tos"
          className="text-white transition-colors hover:text-purple"
        >
          Terms of Service
        </Link>
      </section>
      <section className="flex flex-col gap-2">
        <h4 className="font-bold">POWERED BY</h4>
        <a
          href="https://www.thetvdb.com/"
          className="size-10/12 text-white transition-colors hover:text-purple"
        >
          <img src="https://www.thetvdb.com/images/logo.svg" />
        </a>
        <a
          href="https://www.themoviedb.org"
          className="size-10/12 text-white transition-colors hover:text-purple"
        >
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" />
        </a>
      </section>
    </footer>
  );
}
