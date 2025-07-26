"use client";
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, PlusCircle, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageWithFallback from '@/components/figma/ImageWithFallback';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  book?: {
    title: string;
    author: string;
    cover: string;
  };
  image?: string;
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
  isLiked: boolean;
}

const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4eb?w=150&h=150&fit=crop&crop=face',
        username: 'sarahreads'
      },
      content: 'Just finished this incredible fantasy novel! The world-building is absolutely phenomenal. The way the author weaves magic into everyday life feels so natural and believable. Highly recommend to anyone who loves epic fantasy!',
      book: {
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop'
      },
      likes: 47,
      comments: 12,
      tags: ['Fantasy', 'Magic', 'Epic'],
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: '2',
      user: {
        name: 'Marcus Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        username: 'bookworm_marcus'
      },
      content: 'Reading group discussion was amazing today! We dove deep into the themes of identity and belonging. Here\'s a quote that really stuck with me...',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
      likes: 23,
      comments: 8,
      tags: ['Discussion', 'Philosophy', 'Community'],
      timestamp: '4 hours ago',
      isLiked: true
    },
    {
      id: '3',
      user: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        username: 'emma_lit'
      },
      content: 'Can\'t put this mystery down! The plot twists keep coming and I\'m completely hooked. Anyone else reading this?',
      book: {
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'
      },
      likes: 31,
      comments: 15,
      tags: ['Mystery', 'Thriller', 'PageTurner'],
      timestamp: '6 hours ago',
      isLiked: false
    },
    {
      id: '4',
      user: {
        name: 'David Park',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        username: 'davidreads'
      },
      content: 'Exploring the intersection of technology and humanity in this thought-provoking sci-fi masterpiece. The author\'s vision of the future is both fascinating and terrifying.',
      book: {
        title: 'Neuromancer',
        author: 'William Gibson',
        cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop'
      },
      likes: 38,
      comments: 9,
      tags: ['SciFi', 'Cyberpunk', 'Classic'],
      timestamp: '8 hours ago',
      isLiked: false
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const stats = [
    { label: 'Active Readers', value: '1,247', icon: Users, color: 'text-blue-600' },
    { label: 'Books This Week', value: '89', icon: BookOpen, color: 'text-green-600' },
    { label: 'Trending Discussions', value: '24', icon: TrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 lg:pb-4">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="xl:col-span-3">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Alexandra!</h1>
            <p className="text-lg text-muted-foreground">Catch up on what your reading community has been sharing</p>
          </div>

          {/* Create Post */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b4eb?w=150&h=150&fit=crop&crop=face" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <button className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <span className="text-muted-foreground">Share your latest reading insights...</span>
                  </button>
                  <div className="flex items-center gap-3 mt-4">
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Add Book
                    </Button>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Poll
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{post.user.name}</h4>
                      <p className="text-sm text-muted-foreground">@{post.user.username} • {post.timestamp}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-base leading-relaxed mb-6">{post.content}</p>

                  {post.book && (
                    <div className="flex gap-4 p-4 bg-muted/30 rounded-lg mb-6">
                      <ImageWithFallback
                        src={post.book.cover}
                        alt={post.book.title}
                        className="w-20 h-28 object-cover rounded shadow-sm"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-lg">{post.book.title}</h5>
                        <p className="text-muted-foreground mb-3">by {post.book.author}</p>
                        <Button variant="outline" size="sm">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add to Library
                        </Button>
                      </div>
                    </div>
                  )}

                  {post.image && (
                    <ImageWithFallback
                      src={post.image}
                      alt="Post image"
                      className="w-full h-80 object-cover rounded-lg mb-6"
                    />
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-muted/20 px-6 py-4">
                  <div className="flex items-center gap-6 w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`gap-2 ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                      <Share className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Trending Books */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Fourth Wing', author: 'Rebecca Ross', discussions: 45 },
                { title: 'Lessons in Chemistry', author: 'Bonnie Garmus', discussions: 38 },
                { title: 'The Atlas Six', author: 'Olivie Blake', discussions: 29 }
              ].map((book, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-16 bg-gradient-to-br from-accent/20 to-accent/40 rounded flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{book.title}</h5>
                    <p className="text-xs text-muted-foreground">by {book.author}</p>
                    <p className="text-xs text-accent">{book.discussions} discussions</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Find Reading Groups
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Browse Members
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular Discussions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
