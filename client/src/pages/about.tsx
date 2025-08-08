import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-lavender ml-2">
                Whispering Walls
              </span>
            </h1>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto leading-relaxed">
              A sanctuary for anonymous storytelling, where hearts connect through shared experiences and whispered truths.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="bg-moonlight/10 backdrop-blur-sm border-lavender/20 mb-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <i className="fas fa-heart text-coral text-4xl mb-4"></i>
                <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              </div>
              <p className="text-cool-gray text-lg leading-relaxed text-center">
                Whispering Walls exists to create a safe, anonymous space where people can share their deepest thoughts, 
                emotions, and experiences without fear of judgment. We believe that every story matters, every feeling 
                is valid, and that connection through shared humanity can heal and inspire.
              </p>
            </CardContent>
          </Card>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-moonlight border-lavender/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-shield-alt text-coral text-3xl mb-3"></i>
                  <h3 className="text-xl font-semibold text-midnight">Anonymity First</h3>
                </div>
                <p className="text-cool-gray text-center">
                  Your privacy is sacred. No registration required, no personal data stored, 
                  no way to trace whispers back to you. Share freely, share safely.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-moonlight border-lavender/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-hands-helping text-lavender text-3xl mb-3"></i>
                  <h3 className="text-xl font-semibold text-midnight">Community Support</h3>
                </div>
                <p className="text-cool-gray text-center">
                  We foster a community of empathy and understanding. Every whisper is met with 
                  compassion, every story acknowledged with respect.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-moonlight border-lavender/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-feather-alt text-coral text-3xl mb-3"></i>
                  <h3 className="text-xl font-semibold text-midnight">Gentle Expression</h3>
                </div>
                <p className="text-cool-gray text-center">
                  We encourage thoughtful, gentle communication. Share your truth with kindness, 
                  respond with empathy, and create a space of healing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-moonlight border-lavender/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-globe text-lavender text-3xl mb-3"></i>
                  <h3 className="text-xl font-semibold text-midnight">Global Connection</h3>
                </div>
                <p className="text-cool-gray text-center">
                  Stories transcend borders. Connect with souls from around the world, 
                  united by shared human experiences and emotions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <Card className="bg-moonlight/10 backdrop-blur-sm border-lavender/20 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Started</h2>
              <div className="prose prose-lg text-cool-gray max-w-none">
                <p className="mb-4">
                  Whispering Walls was born from a simple observation: people carry beautiful, painful, 
                  profound stories within them, but often lack a safe space to share them. In our 
                  hyper-connected yet often isolating digital world, we wanted to create something different.
                </p>
                <p className="mb-4">
                  We envisioned digital walls where people could write their secrets, hopes, fears, and 
                  dreams—just like the ancient practice of leaving messages on physical walls. But these 
                  walls would be infinite, accessible to all, and completely anonymous.
                </p>
                <p>
                  Every whisper shared here adds to a collective tapestry of human experience, reminding 
                  us that we are never truly alone in our struggles, our joys, or our journeys.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">What Makes Us Special</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-coral/20 rounded-full p-3 flex-shrink-0">
                  <i className="fas fa-user-secret text-coral"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Complete Anonymity</h3>
                  <p className="text-cool-gray">
                    No accounts, no logins, no tracking. Your whispers are truly anonymous.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-lavender/20 rounded-full p-3 flex-shrink-0">
                  <i className="fas fa-tags text-lavender"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Emotional Tagging</h3>
                  <p className="text-cool-gray">
                    Express your mood and topic to connect with others who share similar experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-coral/20 rounded-full p-3 flex-shrink-0">
                  <i className="fas fa-calendar-alt text-coral"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Daily Themes</h3>
                  <p className="text-cool-gray">
                    Guided prompts help you explore and share specific aspects of your experience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-lavender/20 rounded-full p-3 flex-shrink-0">
                  <i className="fas fa-comments text-lavender"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Supportive Community</h3>
                  <p className="text-cool-gray">
                    Respond to whispers with empathy and support, creating connections that heal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-coral/10 to-lavender/10 border-gradient-to-r border-coral/30 border-lavender/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Share Your Story?</h2>
              <p className="text-cool-gray mb-6 text-lg">
                Join thousands of souls who have found their voice on Whispering Walls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/submit" className="bg-gradient-to-r from-coral to-lavender text-white px-6 py-3 rounded-full font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-300 inline-block">
                  <i className="fas fa-feather-alt mr-2"></i>
                  Share Your Whisper
                </a>
                <a href="/browse" className="border-2 border-lavender/50 text-lavender px-6 py-3 rounded-full font-medium hover:bg-lavender/10 transition-all duration-300 inline-block">
                  <i className="fas fa-eye mr-2"></i>
                  Explore Whispers
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
