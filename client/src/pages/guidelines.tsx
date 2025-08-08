import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Guidelines() {
  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Community Guidelines</h1>
            <p className="text-cool-gray text-lg">
              Creating a safe and supportive space for everyone
            </p>
          </div>

          {/* Welcome Message */}
          <Alert className="bg-moonlight/10 border-lavender/20 mb-8">
            <i className="fas fa-heart text-coral"></i>
            <AlertDescription className="text-cool-gray ml-2">
              Welcome to Whispering Walls! These guidelines help maintain our community as a safe, 
              respectful space where everyone can share their stories and find support.
            </AlertDescription>
          </Alert>

          {/* Core Principles */}
          <Card className="bg-moonlight border-lavender/20 mb-8">
            <CardHeader>
              <CardTitle className="text-midnight flex items-center">
                <i className="fas fa-star text-coral mr-3"></i>
                Core Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-coral/20 rounded-full p-2 flex-shrink-0 mt-1">
                  <i className="fas fa-shield-alt text-coral text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-midnight mb-1">Anonymity is Sacred</h3>
                  <p className="text-cool-gray">
                    Never attempt to identify or "out" another user. Respect the anonymous nature of all whispers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-lavender/20 rounded-full p-2 flex-shrink-0 mt-1">
                  <i className="fas fa-heart text-lavender text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-midnight mb-1">Empathy First</h3>
                  <p className="text-cool-gray">
                    Approach every whisper with understanding and compassion. Everyone has a story worth hearing.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-coral/20 rounded-full p-2 flex-shrink-0 mt-1">
                  <i className="fas fa-hands-helping text-coral text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-midnight mb-1">Support, Don't Judge</h3>
                  <p className="text-cool-gray">
                    Offer support and encouragement. Avoid judgment, criticism, or harsh responses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Welcome */}
          <Card className="bg-moonlight border-lavender/20 mb-8">
            <CardHeader>
              <CardTitle className="text-midnight flex items-center text-green-600">
                <i className="fas fa-check-circle mr-3"></i>
                What's Welcome
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-cool-gray">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Personal stories and experiences
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Genuine emotions and feelings
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Supportive responses and encouragement
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Thoughtful questions and insights
                  </li>
                </ul>
                <ul className="space-y-2 text-cool-gray">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Poetry and creative expression
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Mental health discussions
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Relationship and life advice
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2 text-sm"></i>
                    Gratitude and positive reflections
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* What's Not Allowed */}
          <Card className="bg-moonlight border-red-400/20 mb-8">
            <CardHeader>
              <CardTitle className="text-midnight flex items-center text-red-600">
                <i className="fas fa-times-circle mr-3"></i>
                What's Not Allowed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-cool-gray">
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Harassment or bullying
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Hate speech or discrimination
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Explicit sexual content
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Spam or promotional content
                  </li>
                </ul>
                <ul className="space-y-2 text-cool-gray">
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Threats or violence
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Illegal activities
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Doxxing or revealing personal info
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2 text-sm"></i>
                    Trolling or inflammatory content
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How to Report */}
          <Card className="bg-moonlight border-lavender/20 mb-8">
            <CardHeader>
              <CardTitle className="text-midnight flex items-center">
                <i className="fas fa-flag text-coral mr-3"></i>
                How to Report Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cool-gray mb-4">
                If you encounter content that violates these guidelines, please report it:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-cool-gray ml-4">
                <li>Click the flag icon on any whisper or reply</li>
                <li>Provide a brief reason for the report</li>
                <li>Our moderation team will review within 24 hours</li>
                <li>Flagged content is automatically hidden pending review</li>
              </ol>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="bg-moonlight border-lavender/20 mb-8">
            <CardHeader>
              <CardTitle className="text-midnight flex items-center">
                <i className="fas fa-lightbulb text-lavender mr-3"></i>
                Best Practices for Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-moonlight/50 rounded-lg p-4">
                <h4 className="font-semibold text-midnight mb-2">💭 Before You Whisper</h4>
                <ul className="text-cool-gray space-y-1 text-sm">
                  <li>• Take a moment to reflect on your intention</li>
                  <li>• Consider how your words might affect others</li>
                  <li>• Remember that once shared, whispers become part of the community</li>
                </ul>
              </div>
              
              <div className="bg-moonlight/50 rounded-lg p-4">
                <h4 className="font-semibold text-midnight mb-2">🤝 When Responding</h4>
                <ul className="text-cool-gray space-y-1 text-sm">
                  <li>• Lead with empathy and understanding</li>
                  <li>• Share similar experiences if helpful</li>
                  <li>• Avoid giving unsolicited advice unless asked</li>
                  <li>• Use "I" statements to share your perspective</li>
                </ul>
              </div>
              
              <div className="bg-moonlight/50 rounded-lg p-4">
                <h4 className="font-semibold text-midnight mb-2">🌟 Creating Safe Space</h4>
                <ul className="text-cool-gray space-y-1 text-sm">
                  <li>• Validate others' feelings and experiences</li>
                  <li>• Use content warnings for sensitive topics</li>
                  <li>• Respect different perspectives and backgrounds</li>
                  <li>• Remember that healing looks different for everyone</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Mental Health Resources */}
          <Alert className="bg-lavender/10 border-lavender/30 mb-8">
            <i className="fas fa-heart text-lavender"></i>
            <AlertDescription className="text-cool-gray ml-2">
              <strong>Important:</strong> While our community provides emotional support, we are not a substitute for professional mental health care. 
              If you're experiencing a crisis, please reach out to a mental health professional or crisis hotline in your area.
            </AlertDescription>
          </Alert>

          {/* Contact */}
          <Card className="bg-gradient-to-r from-coral/10 to-lavender/10 border-gradient-to-r border-coral/30 border-lavender/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Questions or Concerns?</h3>
              <p className="text-cool-gray mb-4">
                Our community team is here to help ensure Whispering Walls remains a safe space for everyone.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-coral to-lavender text-white px-6 py-2 rounded-full font-medium hover:from-coral/80 hover:to-lavender/80 transition-all duration-300"
              >
                Contact Us
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
