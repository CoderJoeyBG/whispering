import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/browse", label: "Browse", icon: "fas fa-eye" },
    { href: "/themes", label: "Themes", icon: "fas fa-calendar-day" },
    { href: "/about", label: "About", icon: "fas fa-info-circle" },
    { href: "/guidelines", label: "Guidelines", icon: "fas fa-book" },
    { href: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ];

  const isActivePath = (path: string) => location === path;

  const NavLink = ({ href, children, className = "", onClick }: any) => (
    <Link href={href}>
      <a 
        className={`hover:text-coral transition-colors duration-200 ${className} ${
          isActivePath(href) ? 'text-coral' : 'text-cool-gray'
        }`}
        onClick={onClick}
      >
        {children}
      </a>
    </Link>
  );

  return (
    <nav className="bg-midnight/95 backdrop-blur-sm border-b border-lavender/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/" : "/"}>
            <a className="flex items-center space-x-2">
              <i className="fas fa-feather-alt text-coral text-2xl"></i>
              <span className="text-xl font-semibold text-white">Whispering Walls</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            
            {/* Admin Link for authenticated admin users */}
            {isAuthenticated && user?.isAdmin && (
              <NavLink href="/admin" className="text-lavender">
                <i className="fas fa-shield-alt mr-1"></i>
                Admin
              </NavLink>
            )}

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/submit">
                  <Button className="bg-gradient-to-r from-coral to-lavender text-white px-4 py-2 rounded-full hover:from-coral/80 hover:to-lavender/80 transition-all duration-200">
                    Leave a Whisper
                  </Button>
                </Link>
                <a 
                  href="/api/logout"
                  className="text-cool-gray hover:text-coral transition-colors duration-200"
                >
                  Logout
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/submit">
                  <Button className="bg-gradient-to-r from-coral to-lavender text-white px-4 py-2 rounded-full hover:from-coral/80 hover:to-lavender/80 transition-all duration-200">
                    Leave a Whisper
                  </Button>
                </Link>
                <a 
                  href="/api/login"
                  className="text-cool-gray hover:text-coral transition-colors duration-200"
                >
                  Login
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-cool-gray hover:text-coral">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-midnight border-lavender/20">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.href} 
                    href={item.href}
                    className="flex items-center space-x-2 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className={`${item.icon} w-5`}></i>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                
                {isAuthenticated && user?.isAdmin && (
                  <NavLink 
                    href="/admin" 
                    className="flex items-center space-x-2 text-lg text-lavender"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-shield-alt w-5"></i>
                    <span>Admin</span>
                  </NavLink>
                )}

                <div className="pt-4 border-t border-lavender/20">
                  <Link href="/submit">
                    <Button 
                      className="w-full bg-gradient-to-r from-coral to-lavender text-white mb-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Leave a Whisper
                    </Button>
                  </Link>
                  
                  {isAuthenticated ? (
                    <a 
                      href="/api/logout"
                      className="block text-center text-cool-gray hover:text-coral transition-colors duration-200"
                    >
                      Logout
                    </a>
                  ) : (
                    <a 
                      href="/api/login"
                      className="block text-center text-cool-gray hover:text-coral transition-colors duration-200"
                    >
                      Login
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
