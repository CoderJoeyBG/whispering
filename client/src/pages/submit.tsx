import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Submit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [text, setText] = useState("");
  const [nickname, setNickname] = useState("");
  const [moodTagId, setMoodTagId] = useState("");
  const [topicTagId, setTopicTagId] = useState("");

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/whispers", data);
    },
    onSuccess: () => {
      toast({
        title: "Whisper shared successfully!",
        description: "Your anonymous whisper has been shared with the community.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/whispers"] });
      setLocation("/browse");
    },
    onError: (error) => {
      toast({
        title: "Error sharing whisper",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Please enter your whisper",
        description: "Your whisper cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (text.length > 200) {
      toast({
        title: "Whisper too long",
        description: "Please keep your whisper under 200 characters.",
        variant: "destructive",
      });
      return;
    }

    const whisperData: any = {
      text: text.trim(),
    };

    if (nickname.trim()) {
      whisperData.nickname = nickname.trim();
    }

    if (moodTagId) {
      whisperData.moodTagId = moodTagId;
    }

    if (topicTagId) {
      whisperData.topicTagId = topicTagId;
    }

    submitMutation.mutate(whisperData);
  };

  const remainingChars = 200 - text.length;

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Share Your Whisper</h1>
            <p className="text-cool-gray text-lg">Your story matters. Share it safely and anonymously.</p>
          </div>

          <div className="bg-moonlight rounded-2xl p-8 border border-lavender/20">
            <form onSubmit={handleSubmit}>
              {/* Whisper Text Area */}
              <div className="mb-6">
                <label className="block text-cool-gray font-medium mb-3">Your Whisper</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 bg-moonlight/50 border border-lavender/30 rounded-xl px-4 py-3 text-midnight placeholder-cool-gray/60 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 resize-none"
                  placeholder="Share what's on your heart... (200 characters max)"
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-cool-gray/60">Characters remaining:</span>
                  <span className={`text-sm font-medium ${remainingChars < 20 ? 'text-coral' : 'text-cool-gray'}`}>
                    {remainingChars}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-cool-gray font-medium mb-3">Mood (Optional)</label>
                  <Select value={moodTagId} onValueChange={setMoodTagId}>
                    <SelectTrigger className="w-full bg-moonlight/50 border border-lavender/30 rounded-xl px-4 py-3 text-midnight focus:outline-none focus:border-coral">
                      <SelectValue placeholder="Choose a mood..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tags?.moodTags?.map((tag: any) => (
                        <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-cool-gray font-medium mb-3">Topic (Optional)</label>
                  <Select value={topicTagId} onValueChange={setTopicTagId}>
                    <SelectTrigger className="w-full bg-moonlight/50 border border-lavender/30 rounded-xl px-4 py-3 text-midnight focus:outline-none focus:border-coral">
                      <SelectValue placeholder="Choose a topic..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tags?.topicTags?.map((tag: any) => (
                        <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Anonymous Options */}
              <div className="mb-6">
                <label className="block text-cool-gray font-medium mb-3">Nickname (Optional)</label>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-moonlight/50 border border-lavender/30 rounded-xl px-4 py-3 text-midnight placeholder-cool-gray/60 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
                  placeholder="Choose a nickname or leave blank for full anonymity"
                  maxLength={50}
                />
                <p className="text-sm text-cool-gray/60 mt-2">
                  <i className="fas fa-shield-alt mr-1"></i>
                  No registration required. Your identity remains completely anonymous.
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="w-full bg-gradient-to-r from-coral to-lavender text-white py-4 rounded-xl font-medium text-lg hover:from-coral/80 hover:to-lavender/80 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {submitMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sharing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-feather-alt mr-2"></i>
                    Share Your Whisper
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-cool-gray/60 mt-4">
                By sharing, you agree to our community guidelines of respect and kindness.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
