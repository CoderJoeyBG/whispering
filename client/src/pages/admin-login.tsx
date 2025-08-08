import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      setLocation("/admin");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Access</h1>
            <p className="text-cool-gray">Secure login for site administrators</p>
          </div>

          <div className="bg-moonlight rounded-2xl p-8 border border-lavender/20">
            <div className="text-center">
              <i className="fas fa-shield-alt text-4xl text-coral mb-6"></i>
              <p className="text-midnight mb-6">
                Click the button below to authenticate as an administrator using your Replit account.
              </p>
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-coral to-lavender text-white py-3 rounded-xl font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-200"
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Secure Login
              </Button>
              <p className="text-sm text-cool-gray/60 mt-4">
                Only authorized administrators can access the admin panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
