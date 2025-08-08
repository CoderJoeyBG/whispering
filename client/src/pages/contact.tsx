import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission - in a real app, this would call an API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-cool-gray text-lg">
              We're here to help and listen. Reach out with any questions or concerns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="bg-moonlight border-lavender/20">
              <CardHeader>
                <CardTitle className="text-midnight flex items-center">
                  <i className="fas fa-envelope text-coral mr-3"></i>
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-cool-gray font-medium mb-2">
                      Name <span className="text-coral">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-moonlight/50 border-lavender/30 text-midnight"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cool-gray font-medium mb-2">
                      Email <span className="text-coral">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-moonlight/50 border-lavender/30 text-midnight"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cool-gray font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-moonlight/50 border-lavender/30 text-midnight"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-cool-gray font-medium mb-2">
                      Message <span className="text-coral">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-moonlight/50 border-lavender/30 text-midnight h-32"
                      placeholder="Tell us how we can help..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-coral to-lavender text-white py-3 rounded-xl font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-cool-gray/60 text-center">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & FAQ */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="bg-moonlight/10 backdrop-blur-sm border-lavender/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <i className="fas fa-info-circle text-lavender mr-3"></i>
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-clock text-coral mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-white">Response Time</h4>
                      <p className="text-cool-gray text-sm">Usually within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-shield-alt text-coral mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-white">Privacy</h4>
                      <p className="text-cool-gray text-sm">Your contact information is kept private and secure</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-heart text-coral mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-white">Support</h4>
                      <p className="text-cool-gray text-sm">We're here to help with any questions or concerns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Questions */}
              <Card className="bg-moonlight border-lavender/20">
                <CardHeader>
                  <CardTitle className="text-midnight">Common Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-midnight mb-2">How do I report inappropriate content?</h4>
                    <p className="text-cool-gray text-sm">
                      Click the flag icon on any whisper or reply to report it to our moderation team.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-midnight mb-2">Is my anonymity protected?</h4>
                    <p className="text-cool-gray text-sm">
                      Yes, we don't store any personally identifiable information when you share whispers.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-midnight mb-2">Can I delete my whisper?</h4>
                    <p className="text-cool-gray text-sm">
                      Due to the anonymous nature of whispers, we cannot link them back to specific users for deletion.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-midnight mb-2">How do you handle crisis situations?</h4>
                    <p className="text-cool-gray text-sm">
                      While we provide community support, please contact mental health professionals or crisis hotlines for immediate help.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-gradient-to-r from-coral/10 to-lavender/10 border-gradient-to-r border-coral/30 border-lavender/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <a href="/guidelines" className="block text-cool-gray hover:text-coral transition-colors">
                      <i className="fas fa-book mr-2"></i>
                      Community Guidelines
                    </a>
                    <a href="/about" className="block text-cool-gray hover:text-coral transition-colors">
                      <i className="fas fa-info-circle mr-2"></i>
                      About Whispering Walls
                    </a>
                    <a href="/browse" className="block text-cool-gray hover:text-coral transition-colors">
                      <i className="fas fa-eye mr-2"></i>
                      Browse Whispers
                    </a>
                    <a href="/submit" className="block text-cool-gray hover:text-coral transition-colors">
                      <i className="fas fa-feather-alt mr-2"></i>
                      Share a Whisper
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
