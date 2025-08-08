import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageSquareText, 
  Send, 
  Sparkles, 
  Shield, 
  Users,
  Zap,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const submitSchema = z.object({
  text: z.string().min(10, "Whisper must be at least 10 characters").max(200, "Whisper must be 200 characters or less"),
  nickname: z.string().optional(),
  moodTagId: z.string().optional(),
  topicTagId: z.string().optional(),
});

type SubmitFormData = z.infer<typeof submitSchema>;

export default function Submit() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [characterCount, setCharacterCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [writingTips, setWritingTips] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["/api/tags"],
  });

  const { data: currentTheme } = useQuery({
    queryKey: ["/api/themes/current"],
  });

  const form = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      text: "",
      nickname: "",
      moodTagId: "",
      topicTagId: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitFormData) => {
      return apiRequest("/api/whispers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whispers'] });
      toast({
        title: "Whisper shared successfully",
        description: "Your anonymous whisper has been added to the community.",
      });
      
      // Show success animation
      setTimeout(() => {
        navigate("/browse");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to share whisper",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: SubmitFormData) => {
    submitMutation.mutate(data);
  };

  const watchedText = form.watch("text");
  const watchedMood = form.watch("moodTagId");
  const watchedTopic = form.watch("topicTagId");
  const watchedNickname = form.watch("nickname");

  useEffect(() => {
    setCharacterCount(watchedText?.length || 0);
  }, [watchedText]);

  const getCharacterCountColor = () => {
    if (characterCount > 200) return 'text-red-400';
    if (characterCount > 180) return 'text-orange-400';
    if (characterCount > 160) return 'text-yellow-400';
    return 'text-cool-gray/60';
  };

  const getProgressBarColor = () => {
    if (characterCount > 200) return 'bg-red-400';
    if (characterCount > 180) return 'bg-orange-400';
    if (characterCount > 160) return 'bg-yellow-400';
    return 'bg-gradient-to-r from-coral to-lavender';
  };

  const selectedMoodTag = tags?.moodTags?.find((tag: any) => tag.id === watchedMood);
  const selectedTopicTag = tags?.topicTags?.find((tag: any) => tag.id === watchedTopic);

  const writingPrompts = [
    "What's weighing on your heart today?",
    "Share a moment that changed you",
    "What would you tell your younger self?",
    "Describe a feeling without naming it",
    "What secret makes you smile?",
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % writingPrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-midnight overflow-x-hidden">
      <Navigation />
      
      <section className="py-16 px-4 relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-coral/10 to-lavender/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-electric-blue/10 to-soft-pink/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Share Your</span>
              <br />
              <span className="text-white">Whisper</span>
            </h1>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto mb-8">
              Express yourself anonymously in a safe, supportive space where every voice matters
            </p>
            
            {/* Writing prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card px-6 py-3 inline-block"
            >
              <div className="flex items-center gap-2 text-lavender">
                <Sparkles className="w-4 h-4" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPrompt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-medium"
                  >
                    {writingPrompts[currentPrompt]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Current Theme */}
          <AnimatePresence>
            {currentTheme && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <Card className="glass-card border-lavender/30 bg-gradient-to-r from-lavender/5 to-electric-blue/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-lavender/10 to-transparent opacity-50" />
                  <CardHeader className="pb-3 relative">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6 text-lavender" />
                      </motion.div>
                      <CardTitle className="text-xl text-lavender font-bold">Featured Theme</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <h3 className="text-2xl font-bold text-white mb-2">{currentTheme.title}</h3>
                    <p className="text-cool-gray leading-relaxed">{currentTheme.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass-card border-0 shadow-2xl relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-coral via-lavender to-electric-blue opacity-20 blur-sm" />
              <div className="absolute inset-[1px] bg-midnight rounded-2xl" />
              
              <div className="relative">
                <CardHeader className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-coral to-lavender rounded-full flex items-center justify-center"
                  >
                    <MessageSquareText className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-3xl text-white font-bold">Anonymous Whisper</CardTitle>
                  <CardDescription className="text-cool-gray text-lg">
                    Share your thoughts, feelings, or experiences. Your identity remains completely private.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                      {/* Main Text Field */}
                      <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center gap-3 text-lg font-semibold">
                              <MessageSquareText className="w-5 h-5" />
                              Your Whisper
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Textarea
                                  ref={textareaRef}
                                  placeholder="What's on your heart? Share your thoughts, confessions, or feelings..."
                                  className="min-h-[140px] resize-none bg-moonlight/20 border-cool-gray/20 focus:border-coral focus:ring-2 focus:ring-coral/20 text-white placeholder:text-cool-gray/50 text-lg leading-relaxed transition-all duration-300 group-hover:bg-moonlight/30"
                                  {...field}
                                />
                                
                                {/* Character count and progress */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                                  <div className="w-12 h-2 bg-moonlight/30 rounded-full overflow-hidden">
                                    <motion.div
                                      className={`h-full ${getProgressBarColor()}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(100, (characterCount / 200) * 100)}%` }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                  <div className={`text-sm font-semibold ${getCharacterCountColor()}`}>
                                    {characterCount}/200
                                  </div>
                                </div>
                                
                                {/* Preview toggle */}
                                <button
                                  type="button"
                                  onClick={() => setIsPreview(!isPreview)}
                                  className="absolute top-3 right-3 p-2 text-cool-gray/60 hover:text-cool-gray transition-colors"
                                >
                                  {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormDescription className="text-cool-gray/70 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Express yourself authentically. Your message will be completely anonymous.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Preview */}
                      <AnimatePresence>
                        {isPreview && watchedText && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card p-6"
                          >
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Preview
                            </h4>
                            <div className="text-cool-gray leading-relaxed mb-4">
                              {watchedText}
                            </div>
                            {watchedNickname && (
                              <div className="flex items-center gap-2 text-sm text-cool-gray/60">
                                <Sparkles className="w-3 h-3 text-lavender" />
                                <span className="italic">— {watchedNickname}</span>
                              </div>
                            )}
                            <div className="flex gap-2 mt-3">
                              {selectedMoodTag && (
                                <Badge className="bg-coral/20 text-coral border-coral/30 text-xs">
                                  {selectedMoodTag.name}
                                </Badge>
                              )}
                              {selectedTopicTag && (
                                <Badge className="bg-lavender/20 text-lavender border-lavender/30 text-xs">
                                  {selectedTopicTag.name}
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Nickname Field */}
                      <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-lg font-semibold">Anonymous Nickname (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., A hopeful soul, Someone who cares, Midnight dreamer..."
                                className="bg-moonlight/20 border-cool-gray/20 focus:border-lavender focus:ring-2 focus:ring-lavender/20 text-white placeholder:text-cool-gray/50 h-12 text-lg transition-all duration-300 hover:bg-moonlight/30"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-cool-gray/70">
                              Add a poetic signature to your whisper (completely optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tags Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="moodTagId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-3 text-lg font-semibold">
                                <Heart className="w-5 h-5" />
                                Mood
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-card border-cool-gray/20 hover:border-coral/30 focus:border-coral focus:ring-2 focus:ring-coral/20 text-white h-12 transition-all duration-300">
                                    <SelectValue placeholder="How are you feeling?" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="glass-card border-cool-gray/20">
                                  <SelectItem value="all">No specific mood</SelectItem>
                                  {tags?.moodTags?.map((tag: any) => (
                                    <SelectItem key={tag.id} value={tag.id}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-coral rounded-full" />
                                        {tag.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-cool-gray/70">
                                Help others understand your emotional state
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="topicTagId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white flex items-center gap-3 text-lg font-semibold">
                                <Sparkles className="w-5 h-5" />
                                Topic
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-card border-cool-gray/20 hover:border-lavender/30 focus:border-lavender focus:ring-2 focus:ring-lavender/20 text-white h-12 transition-all duration-300">
                                    <SelectValue placeholder="What's this about?" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="glass-card border-cool-gray/20">
                                  <SelectItem value="all">General</SelectItem>
                                  {tags?.topicTags?.map((tag: any) => (
                                    <SelectItem key={tag.id} value={tag.id}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-lavender rounded-full" />
                                        {tag.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-cool-gray/70">
                                Categorize your whisper for better discovery
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit Section */}
                      <div className="border-t border-cool-gray/10 pt-8">
                        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                          {/* Safety Features */}
                          <div className="space-y-2 text-sm text-cool-gray/70">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span>Completely anonymous</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span>No account required</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span>Safe and moderated</span>
                            </div>
                          </div>
                          
                          {/* Submit Button */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="submit" 
                              disabled={submitMutation.isPending || characterCount > 200 || characterCount < 10}
                              className="btn-primary px-12 py-4 text-lg font-bold shadow-xl relative overflow-hidden group"
                            >
                              <AnimatePresence mode="wait">
                                {submitMutation.isPending ? (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center"
                                  >
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                    />
                                    Sharing your whisper...
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center"
                                  >
                                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                                    Share Whisper
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Community Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="glass-card border-cool-gray/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-electric-blue" />
                  <CardTitle className="text-white text-xl">Community Guidelines</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Encouraged
                    </h4>
                    <ul className="space-y-2 text-cool-gray">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Authentic self-expression
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Supportive responses
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Respectful dialogue
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Personal experiences
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Not Allowed
                    </h4>
                    <ul className="space-y-2 text-cool-gray">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Harassment or bullying
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Spam or promotional content
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Explicit or graphic content
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Personal information sharing
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Writing Tips */}
          <AnimatePresence>
            {writingTips && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8"
              >
                <Card className="glass-card border-lavender/20 bg-gradient-to-r from-lavender/5 to-transparent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-lavender" />
                        <CardTitle className="text-lg text-lavender">Writing Tips</CardTitle>
                      </div>
                      <button
                        onClick={() => setWritingTips(false)}
                        className="text-cool-gray/60 hover:text-cool-gray transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-moonlight/20 rounded-lg">
                        <h5 className="font-semibold text-white mb-2">Be Authentic</h5>
                        <p className="text-cool-gray/70">Write from the heart. Genuine emotions resonate most.</p>
                      </div>
                      <div className="p-3 bg-moonlight/20 rounded-lg">
                        <h5 className="font-semibold text-white mb-2">Use Imagery</h5>
                        <p className="text-cool-gray/70">Paint pictures with words. Describe feelings through metaphor.</p>
                      </div>
                      <div className="p-3 bg-moonlight/20 rounded-lg">
                        <h5 className="font-semibold text-white mb-2">Keep It Concise</h5>
                        <p className="text-cool-gray/70">Every word counts in 200 characters. Make them powerful.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}