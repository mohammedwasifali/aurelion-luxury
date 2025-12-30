import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-onyx border-t border-border/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl tracking-[0.3em] text-foreground mb-4">
              AURELION
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-elegant text-lg">
              Crafting timeless elegance since 1892. Where luxury meets artistry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground mb-6 font-body">
              Explore
            </h4>
            <ul className="space-y-3">
              {['Collection', 'New Arrivals', 'Heritage', 'Craftsmanship'].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Services */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground mb-6 font-body">
              Client Services
            </h4>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping', 'Returns', 'Size Guide'].map((item) => (
                <li key={item}>
                  <span className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground mb-6 font-body">
              Connect
            </h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm font-body">
              contact@aurelion.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-xs tracking-wider font-body">
            © 2024 AURELION. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-muted-foreground text-xs tracking-wider font-body cursor-pointer hover:text-primary transition-colors">
              Privacy Policy
            </span>
            <span className="text-muted-foreground text-xs tracking-wider font-body cursor-pointer hover:text-primary transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
