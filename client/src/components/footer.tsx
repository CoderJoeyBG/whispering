import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-midnight/95 border-t border-lavender/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-feather-alt text-coral text-2xl"></i>
              <span className="text-xl font-semibold text-white">Whispering Walls</span>
            </div>
            <p className="text-cool-gray mb-4">
              A safe space for anonymous stories, creating connection through shared human experiences.
            </p>
            <div className="flex space-x-4">
              <button className="text-cool-gray/60 hover:text-coral transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </button>
              <button className="text-cool-gray/60 hover:text-coral transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </button>
              <button className="text-cool-gray/60 hover:text-coral transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/browse">
                  <a className="text-cool-gray hover:text-coral transition-colors">Browse Whispers</a>
                </Link>
              </li>
              <li>
                <Link href="/themes">
                  <a className="text-cool-gray hover:text-coral transition-colors">Daily Themes</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-cool-gray hover:text-coral transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/submit">
                  <a className="text-cool-gray hover:text-coral transition-colors">Share a Whisper</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/guidelines">
                  <a className="text-cool-gray hover:text-coral transition-colors">Guidelines</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-cool-gray hover:text-coral transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-cool-gray hover:text-coral transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-cool-gray hover:text-coral transition-colors">Help Center</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-lavender/20 mt-8 pt-8 text-center">
          <p className="text-cool-gray/60">
            © 2024 Whispering Walls. Made with ❤️ for safe storytelling.
          </p>
        </div>
      </div>
    </footer>
  );
}
