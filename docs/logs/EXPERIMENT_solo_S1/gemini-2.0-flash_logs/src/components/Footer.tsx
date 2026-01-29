import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sitemap */}
          <div>
            <h6 className="font-semibold">Sitemap</h6>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/" className="hover:text-gray-500">Home</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-gray-500">Pricing</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-500">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h6 className="font-semibold">Social</h6>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-500">© {new Date().getFullYear()} PRIM-Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
