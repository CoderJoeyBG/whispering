import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Theme form state
  const [themeTitle, setThemeTitle] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [themeStartDate, setThemeStartDate] = useState("");
  const [themeEndDate, setThemeEndDate] = useState("");

  // Tag form state
  const [newMoodTag, setNewMoodTag] = useState("");
  const [newTopicTag, setNewTopicTag] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  const { data: flaggedContent, isLoading: flaggedLoading } = useQuery({
    queryKey: ["/api/admin/flagged"],
    retry: false,
  });

  const { data: tags } = useQuery({
    queryKey: ["/api/tags"],
  });

  const createThemeMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/themes", data);
    },
    onSuccess: () => {
      toast({
        title: "Theme created successfully!",
        description: "The new theme has been added.",
      });
      setThemeTitle("");
      setThemeDescription("");
      setThemeStartDate("");
      setThemeEndDate("");
      queryClient.invalidateQueries({ queryKey: ["/api/themes"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error creating theme",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createMoodTagMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/tags/mood", data);
    },
    onSuccess: () => {
      toast({
        title: "Mood tag created successfully!",
      });
      setNewMoodTag("");
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error creating mood tag",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createTopicTagMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/tags/topic", data);
    },
    onSuccess: () => {
      toast({
        title: "Topic tag created successfully!",
      });
      setNewTopicTag("");
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error creating topic tag",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      await apiRequest("DELETE", `/api/admin/content/${type}/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Content deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flagged"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error deleting content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeTitle || !themeDescription || !themeStartDate || !themeEndDate) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    createThemeMutation.mutate({
      title: themeTitle,
      description: themeDescription,
      startDate: new Date(themeStartDate).toISOString(),
      endDate: new Date(themeEndDate).toISOString(),
      isActive: true,
    });
  };

  const handleCreateMoodTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoodTag.trim()) return;

    createMoodTagMutation.mutate({
      name: newMoodTag.trim(),
      description: `${newMoodTag} mood tag`,
    });
  };

  const handleCreateTopicTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTag.trim()) return;

    createTopicTagMutation.mutate({
      name: newTopicTag.trim(),
      description: `${newTopicTag} topic tag`,
    });
  };

  const handleDeleteContent = (type: string, id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      deleteContentMutation.mutate({ type, id });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-2xl text-cool-gray mr-4"></i>
          <span className="text-cool-gray">Loading...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-cool-gray">Monitor and moderate the Whispering Walls community</p>
          </div>

          {/* Stats Overview */}
          {statsLoading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-cool-gray"></i>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-moonlight border-lavender/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cool-gray/60 text-sm">Total Whispers</p>
                      <p className="text-2xl font-bold text-midnight">{stats?.totalWhispers || 0}</p>
                    </div>
                    <i className="fas fa-feather-alt text-coral text-2xl"></i>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-moonlight border-lavender/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cool-gray/60 text-sm">Flagged Content</p>
                      <p className="text-2xl font-bold text-coral">{stats?.flaggedContent || 0}</p>
                    </div>
                    <i className="fas fa-flag text-coral text-2xl"></i>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-moonlight border-lavender/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cool-gray/60 text-sm">Total Replies</p>
                      <p className="text-2xl font-bold text-midnight">{stats?.totalReplies || 0}</p>
                    </div>
                    <i className="fas fa-comments text-lavender text-2xl"></i>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-moonlight border-lavender/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cool-gray/60 text-sm">Today's Whispers</p>
                      <p className="text-2xl font-bold text-midnight">{stats?.todayWhispers || 0}</p>
                    </div>
                    <i className="fas fa-calendar-day text-lavender text-2xl"></i>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Flagged Content */}
            <Card className="bg-moonlight border-lavender/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-midnight">Flagged Content</CardTitle>
                  <Badge variant="destructive">{flaggedContent?.length || 0} pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {flaggedLoading ? (
                  <div className="text-center py-4">
                    <i className="fas fa-spinner fa-spin text-cool-gray"></i>
                  </div>
                ) : flaggedContent && flaggedContent.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {flaggedContent.map((item: any) => (
                      <div key={item.id} className="bg-moonlight/50 rounded-xl p-4 border border-coral/20">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm text-coral font-medium">
                            Reported: {item.reason}
                          </span>
                          <span className="text-xs text-cool-gray/60">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-midnight text-sm mb-3 italic">
                          "{(item.whisper?.text || item.reply?.text || "").substring(0, 100)}..."
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteContent(
                              item.contentType,
                              item.contentId
                            )}
                            disabled={deleteContentMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-check-circle text-2xl text-green-500 mb-2"></i>
                    <p className="text-cool-gray">No flagged content</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tag Management */}
            <Card className="bg-moonlight border-lavender/20">
              <CardHeader>
                <CardTitle className="text-midnight">Tag Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-midnight mb-2">Mood Tags</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags?.moodTags?.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary" className="bg-coral/20 text-coral">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <form onSubmit={handleCreateMoodTag} className="flex gap-2">
                    <Input
                      value={newMoodTag}
                      onChange={(e) => setNewMoodTag(e.target.value)}
                      placeholder="New mood tag..."
                      className="bg-moonlight/50 border-lavender/30"
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={createMoodTagMutation.isPending}
                      className="bg-coral hover:bg-coral/80"
                    >
                      Add
                    </Button>
                  </form>
                </div>
                
                <div>
                  <h4 className="font-medium text-midnight mb-2">Topic Tags</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags?.topicTags?.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary" className="bg-lavender/20 text-lavender">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <form onSubmit={handleCreateTopicTag} className="flex gap-2">
                    <Input
                      value={newTopicTag}
                      onChange={(e) => setNewTopicTag(e.target.value)}
                      placeholder="New topic tag..."
                      className="bg-moonlight/50 border-lavender/30"
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={createTopicTagMutation.isPending}
                      className="bg-lavender hover:bg-lavender/80 text-midnight"
                    >
                      Add
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Management */}
          <Card className="bg-moonlight border-lavender/20">
            <CardHeader>
              <CardTitle className="text-midnight">Create New Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTheme} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={themeTitle}
                      onChange={(e) => setThemeTitle(e.target.value)}
                      placeholder="Theme title..."
                      className="bg-moonlight/50 border-lavender/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={themeStartDate}
                      onChange={(e) => setThemeStartDate(e.target.value)}
                      className="bg-moonlight/50 border-lavender/30"
                    />
                    <Input
                      type="date"
                      value={themeEndDate}
                      onChange={(e) => setThemeEndDate(e.target.value)}
                      className="bg-moonlight/50 border-lavender/30"
                    />
                  </div>
                </div>
                <Textarea
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                  placeholder="Theme description..."
                  className="bg-moonlight/50 border-lavender/30"
                />
                <Button 
                  type="submit" 
                  disabled={createThemeMutation.isPending}
                  className="bg-gradient-to-r from-coral to-lavender text-white"
                >
                  {createThemeMutation.isPending ? "Creating..." : "Create Theme"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
