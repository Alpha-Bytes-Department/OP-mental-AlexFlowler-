import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2D2A2B] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col justify-between sm:flex-row gap-8 lg:gap-12 ">
          {/* Company Description */}
          <div className=" max-w-md">
            <h3 className="text-xl font-bold mb-4">Optimal Performance</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Optimal Performance delivers evidence-based, expert-driven
              strategies that empower high performers and organizations to
              achieve performance and wellness results, while providing a
              trusted platform for qualified professionals to share their
              expertise and scale their impact.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link
                to="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>

              <Link
                to="#"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </Link>

              <Link
                to="#"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>

              <Link
                to="#"
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-7">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="flex flex-col gap-7">
              <li>
                <span className="text-gray-300">Privacy</span>
              </li>
              <li>
                <span className="text-gray-300">Policy</span>
              </li>
              <li>
                <span className="text-gray-300">Terms</span>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="text-xl  font-bold mb-4">Social Icons</h3>
            <ul className="flex flex-col gap-5">
              <li>
                <Link
                  to="/instagram"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  to="/facebook"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  to="/linkedin"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  to="/twitter"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">›</span>
                  Twitter (X)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
      </div>{" "}
      <hr className=" border-[#FAFAFD] mt-20 border-t-2 max-w-7xl mx-auto"/>
      <div className=" mt-2 max-w-4xl mx-auto">
        <div className="">
          
          <div className="flex flex-wrap flex-col px-5 sm:flex-row justify-between  space-x-6 text-sm text-gray-400"><div className="text-gray-400 text-sm">
            Copyright 2025 fenyx femme
          </div>
            <Link to="/terms" className="hover:text-white transition-colors">
              Inc Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/legal" className="hover:text-white transition-colors">
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
