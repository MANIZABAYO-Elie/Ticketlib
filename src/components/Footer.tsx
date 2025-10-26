import React from "react";
import { Link } from "react-router-dom";
import { FaGooglePlay, FaApple, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-800">
      {/* === Main Footer Content === */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* === Brand Section === */}
        <div className="space-y-4">
          <h3 className="text-white text-2xl font-bold">TicketLib</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Rwanda's premier event ticketing platform by IBAKWE Devforge.
          </p>

          {/* App Download Buttons */}
          <div className="pt-2 space-y-3">
            <p className="text-sm font-semibold text-white">Download the App</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/download/android"
                className="flex items-center bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition-colors"
              >
                <FaGooglePlay className="w-5 h-5 mr-2" />
                Google Play
              </Link>

              <Link
                to="/download/ios"
                className="flex items-center bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition-colors"
              >
                <FaApple className="w-5 h-5 mr-2" />
                App Store
              </Link>
            </div>
          </div>
        </div>

        {/* === Quick Links === */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/events" className="text-sm hover:text-white transition-colors">
                Browse Events
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="text-sm hover:text-white transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* === Contact Section === */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="block text-gray-400">Phone</span>
              <Link to="/contact" className="hover:text-white transition-colors">
                Call: 2838
              </Link>
            </li>
            <li>
              <span className="block text-gray-400">WhatsApp</span>
              <Link to="/contact" className="hover:text-white transition-colors">
                +250 787 272 036
              </Link>
            </li>
            <li>
              <span className="block text-gray-400">Email</span>
              <Link to="/contact" className="hover:text-white transition-colors">
                support@ticqet.rw
              </Link>
            </li>
            <li>
              <span className="block text-gray-400">Location</span>
              <Link to="/contact" className="hover:text-white transition-colors">
                Kigali, Rwanda
              </Link>
            </li>
          </ul>
        </div>

        {/* === Follow Us === */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-3">
            <Link
              to="/facebook"
              className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-5 h-5" />
            </Link>
            <Link
              to="/twitter"
              className="w-10 h-10 bg-slate-700 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </Link>
            <Link
              to="/instagram"
              className="w-10 h-10 bg-slate-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </Link>
            <Link
              to="/linkedin"
              className="w-10 h-10 bg-slate-700 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* === Bottom Bar === */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} TicQet. All rights reserved. Delivering Tomorrow's Solutions Today.
          </p>
          <div className="flex gap-6 mt-3 sm:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
