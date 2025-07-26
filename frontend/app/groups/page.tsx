"use client";
import React, { useState } from 'react';
import { Users, Plus, Search, Calendar, Target, MessageCircle, BookOpen, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import  ImageWithFallback  from '@/components/figma/ImageWithFallback';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  currentBook: {
    title: string;
    author: string;
    cover: string;
    totalPages: number;
  };
  dailyGoal: number;
  progress: number;
  recentActivity: string;
  isJoined: boolean;
  isOwner?: boolean;
  members: Array<{ name: string; avatar: string; }>;
}

const GroupsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined');
  const [searchQuery, setSearchQuery] = useState('');

  const joinedGroups: Group[] = [
    {
      id: '1',
      name: 'Fantasy Fanatics',
      description: 'Exploring magical worlds and epic adventures together',
      memberCount: 124,
      currentBook: {
        title: 'The Way of Kings',
        author: 'Brandon Sanderson',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
        totalPages: 1007
      },
      dailyGoal: 25,
      progress: 68,
      recentActivity: '3 new summaries today',
      isJoined: true,
      isOwner: true,
      members: [
        { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4eb?w=150&h=150&fit=crop&crop=face' },
        { name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
        { name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
      ]
    },
    {
      id: '2',
      name: 'Mystery Book Club',
      description: 'Solving mysteries one page at a time',
      memberCount: 87,
      currentBook: {
        title: 'The Thursday Murder Club',
        author: 'Richard Osman',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
        totalPages: 368
      },
      dailyGoal: 15,
      progress: 45,
      recentActivity: '2 discussions active',
      isJoined: true,
      members: [
        { name: 'David', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
        { name: 'Lisa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' }
      ]
    }
  ];

  const discoverGroups: Group[] = [
    {
      id: '3',
      name: 'Sci-Fi Explorers',
      description: 'Journey through space, time, and imagination',
      memberCount: 156,
      currentBook: {
        title: 'Dune',
        author: 'Frank Herbert',
        cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop',
        totalPages: 688
      },
      dailyGoal: 20,
      progress: 30,
      recentActivity: 'Very active community',
      isJoined: false,
      members: [
        { name: 'Alex', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face' },
        { name: 'Maya', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face' }
      ]
    },
    {
      id: '4',
      name: 'Literary Classics',
      description: 'Diving deep into timeless literature',
      memberCount: 203,
      currentBook: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
        totalPages: 432
      },
      dailyGoal: 18,
      progress: 55,
      recentActivity: 'Weekly discussions',
      isJoined: false,
      members: [
        { name: 'Grace', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face' },
        { name: 'James', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
      ]
    }
  ];

  const renderGroupCard = (group: Group) => (
    <Card key={group.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {group.name}
              {group.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {group.memberCount} members
              </div>
              <Badge variant="secondary" className="text-xs">
                {group.recentActivity}
              </Badge>
            </div>
          </div>
          {group.isJoined ? (
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Join
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Current Book */}
          <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
            <ImageWithFallback
              src={group.currentBook.cover}
              alt={group.currentBook.title}
              className="w-12 h-18 object-cover rounded"
            />
            <div className="flex-1">
              <h5 className="font-medium text-sm">{group.currentBook.title}</h5>
              <p className="text-xs text-muted-foreground">by {group.currentBook.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <Target className="w-3 h-3 text-accent" />
                <span className="text-xs">{group.dailyGoal} pages/day</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Group Progress</span>
              <span className="text-muted-foreground">{group.progress}%</span>
            </div>
            <Progress value={group.progress} className="h-2" />
          </div>

          {/* Members */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {group.members.slice(0, 4).map((member, index) => (
                <Avatar key={index} className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {group.memberCount > 4 && (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                  +{group.memberCount - 4}
                </div>
              )}
            </div>
            {group.isJoined && (
              <Button variant="outline" size="sm">
                Submit Summary
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reading Groups</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant={activeTab === 'joined' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('joined')}
        >
          My Groups ({joinedGroups.length})
        </Button>
        <Button
          variant={activeTab === 'discover' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </Button>
      </div>

      {/* Search */}
      {activeTab === 'discover' && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeTab === 'joined'
          ? joinedGroups.map(renderGroupCard)
          : discoverGroups.map(renderGroupCard)
        }
      </div>
    </div>
  );
};

export default GroupsPage; 