// footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-row justify-start items-center gap-6 w-full h-auto px-6 py-3 bg-gray-900 text-white">
      <section className="flex flex-col gap-2">
        <h4>Quick Links</h4>
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
      </section>
      <section className="flex flex-col gap-2">
        <h4>Socials</h4>
        {/* Add social media links here */}
      </section>
      <section className="flex flex-col gap-2">
        <h4>Help & Support</h4>
        <Link
          to="/contact"
          className="text-white transition-colors hover:text-purple"
        >
          Contact Us
        </Link>
        <Link
          to="/faq"
          className="text-white transition-colors hover:text-purple"
        >
          FAQ
        </Link>
      </section>
      <section className="flex flex-col gap-2">
        <h4>Legal & Privacy</h4>
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
    </footer>
  );
}
