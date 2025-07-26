"use client";
import React, { useState } from 'react';
import { Settings, Edit, BookOpen, Star, Calendar, Award, Users, TrendingUp, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const userProfile = {
    name: 'Alexandra Reed',
    username: 'alex_reads',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4eb?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate reader, fantasy lover, and part-time book reviewer. Always looking for the next great adventure between pages.',
    joinDate: 'March 2023',
    location: 'San Francisco, CA',
    stats: {
      booksRead: 47,
      currentStreak: 23,
      totalPages: 12847,
      averageRating: 4.2,
      groupsJoined: 5,
      summariesWritten: 34
    }
  };

  const currentlyReading = [
    {
      id: '1',
      title: 'The Way of Kings',
      author: 'Brandon Sanderson',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
      progress: 68,
      group: 'Fantasy Fanatics'
    },
    {
      id: '2',
      title: 'The Thursday Murder Club',
      author: 'Richard Osman',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
      progress: 45,
      group: 'Mystery Book Club'
    }
  ];

  const recentlyFinished = [
    {
      id: '1',
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
      rating: 5,
      dateFinished: '2 days ago',
      review: 'Absolutely incredible world-building and storytelling...'
    },
    {
      id: '2',
      title: 'Gone Girl',
      author: 'Gillian Flynn',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
      rating: 4,
      dateFinished: '1 week ago',
      review: 'A twisted psychological thriller that keeps you guessing...'
    },
    {
      id: '3',
      title: 'Educated',
      author: 'Tara Westover',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
      rating: 5,
      dateFinished: '2 weeks ago',
      review: 'A powerful memoir about education and family...'
    }
  ];

  const bookmarks = [
    {
      id: '1',
      title: 'Best Fantasy Books of 2024',
      type: 'Article',
      source: 'BookLovers Magazine',
      dateAdded: '3 days ago'
    },
    {
      id: '2',
      title: 'Understanding Magical Systems',
      type: 'Discussion',
      source: 'Fantasy Fanatics',
      dateAdded: '1 week ago'
    },
    {
      id: '3',
      title: 'The Art of Character Development',
      type: 'Video',
      source: 'Writing Masterclass',
      dateAdded: '2 weeks ago'
    }
  ];

  const achievements = [
    { name: 'Speed Reader', description: '10 books in a month', icon: '🏃‍♀️', earned: true },
    { name: 'Consistency King', description: '30-day reading streak', icon: '🔥', earned: true },
    { name: 'Genre Explorer', description: 'Read 5 different genres', icon: '🗺️', earned: true },
    { name: 'Community Leader', description: 'Lead a reading group', icon: '👑', earned: false },
    { name: 'Review Master', description: 'Write 50 book reviews', icon: '✍️', earned: false },
    { name: 'Page Turner', description: 'Read 50,000 pages', icon: '📚', earned: false }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 lg:pb-4">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="text-2xl">AR</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  <p className="text-muted-foreground">@{userProfile.username}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-4">{userProfile.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {userProfile.joinDate}
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  {userProfile.location}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProfile.stats.booksRead}</div>
            <div className="text-xs text-muted-foreground">Books Read</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProfile.stats.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <span className="text-2xl mb-2 block">📄</span>
            <div className="text-2xl font-bold">{userProfile.stats.totalPages.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Pages Read</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProfile.stats.averageRating}</div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProfile.stats.groupsJoined}</div>
            <div className="text-xs text-muted-foreground">Groups</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProfile.stats.summariesWritten}</div>
            <div className="text-xs text-muted-foreground">Summaries</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Currently Reading */}
          <Card>
            <CardHeader>
              <CardTitle>Currently Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentlyReading.map((book) => (
                  <div key={book.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    {/* <ImageWithFallback
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded"
                    /> */}
                    <div className="flex-1">
                      <h4 className="font-medium">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      <Badge variant="outline" className="text-xs mt-2">{book.group}</Badge>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm text-muted-foreground">{book.progress}%</span>
                        </div>
                        <Progress value={book.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reading Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Reading Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Completed "The Name of the Wind" - Rated 5 stars</span>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Joined "Sci-Fi Explorers" reading group</span>
                  <span className="text-xs text-muted-foreground">3 days ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">Submitted summary for chapters 8-10</span>
                  <span className="text-xs text-muted-foreground">4 days ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-sm">Achieved 20-day reading streak!</span>
                  <span className="text-xs text-muted-foreground">5 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recently Finished</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentlyFinished.map((book) => (
                    <div key={book.id} className="flex gap-3">
                      {/* <ImageWithFallback
                        src={book.cover}
                        alt={book.title}
                        className="w-12 h-18 object-cover rounded"
                      /> */}
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{book.title}</h5>
                        <p className="text-xs text-muted-foreground">by {book.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < book.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{book.dateFinished}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reading Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">2024 Reading Goal</span>
                    <span className="text-sm text-muted-foreground">47/60 books</span>
                  </div>
                  <Progress value={(47/60) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Monthly Pages</span>
                    <span className="text-sm text-muted-foreground">2,847/3,000 pages</span>
                  </div>
                  <Progress value={(2847/3000) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Reading Streak</span>
                    <span className="text-sm text-muted-foreground">23 days</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                Saved Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{bookmark.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{bookmark.type}</Badge>
                          <span className="text-sm text-muted-foreground">{bookmark.source}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Saved {bookmark.dateAdded}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg text-center ${
                      achievement.earned
                        ? 'border-accent bg-accent/5'
                        : 'border-muted bg-muted/20 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium mb-1">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.earned && (
                      <Badge variant="default" className="mt-2 text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
