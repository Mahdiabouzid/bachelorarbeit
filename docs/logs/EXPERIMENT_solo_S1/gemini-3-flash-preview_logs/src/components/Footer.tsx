import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Sitemap</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-slate-600 hover:text-indigo-600">Home</Link></li>
              <li><Link to="/pricing" className="text-slate-600 hover:text-indigo-600">Pricing</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Connect</h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-indigo-600" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600" aria-label="GitHub">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} PRIM-Agency. All rights reserved. Built for excellence.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;