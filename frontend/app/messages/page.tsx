"use client";
import React, { useState } from 'react';
import { Send, Paperclip, Search, ArrowLeft, MoreVertical, Users, Phone, Video, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'quote';
}

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  members?: number;
}

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Fantasy Fanatics',
      type: 'group',
      avatar: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop',
      lastMessage: 'What did everyone think of chapter 12?',
      lastMessageTime: '2m ago',
      unreadCount: 3,
      members: 124
    },
    {
      id: '2',
      name: 'Sarah Chen',
      type: 'direct',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4eb?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Thanks for the book recommendation!',
      lastMessageTime: '1h ago',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '3',
      name: 'Mystery Book Club',
      type: 'group',
      avatar: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150&h=150&fit=crop',
      lastMessage: 'Marcus: I figured out who the killer is!',
      lastMessageTime: '3h ago',
      unreadCount: 0,
      members: 87
    },
    {
      id: '4',
      name: 'Emma Rodriguez',
      type: 'direct',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Have you read any good thrillers lately?',
      lastMessageTime: '5h ago',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '5',
      name: 'Sci-Fi Explorers',
      type: 'group',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop',
      lastMessage: 'Discussion about Dune continues...',
      lastMessageTime: '1d ago',
      unreadCount: 0,
      members: 156
    }
  ];

  const messages: ChatMessage[] = [
    {
      id: '1',
      senderId: 'sarah123',
      senderName: 'Sarah Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4eb?w=150&h=150&fit=crop&crop=face',
      content: 'Hey everyone! Just finished chapter 12 and I\'m absolutely blown away. The plot twist with Kaladin was incredible!',
      timestamp: '2:30 PM',
      type: 'text'
    },
    {
      id: '2',
      senderId: 'marcus456',
      senderName: 'Marcus Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'RIGHT?! I had to reread that section twice. Sanderson really knows how to subvert expectations.',
      timestamp: '2:32 PM',
      type: 'text'
    },
    {
      id: '3',
      senderId: 'emma789',
      senderName: 'Emma Rodriguez',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: '"The most important step a man can take. It\'s not the first one, is it? It\'s the next one. Always the next one." - This quote hit me so hard.',
      timestamp: '2:35 PM',
      type: 'quote'
    },
    {
      id: '4',
      senderId: 'user123',
      senderName: 'You',
      senderAvatar: '',
      content: 'What did everyone think of chapter 12?',
      timestamp: '2:38 PM',
      type: 'text'
    },
    {
      id: '5',
      senderId: 'david890',
      senderName: 'David Park',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The character development has been phenomenal throughout this section. I love how each character is facing their own internal struggles.',
      timestamp: '2:40 PM',
      type: 'text'
    }
  ];

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const sendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      setMessageInput('');
    }
  };

  const renderChatList = () => (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => setSelectedChat(chat.id)}
          className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
            selectedChat === chat.id
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              {chat.type === 'direct' && chat.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold truncate">{chat.name}</h4>
                <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
              {chat.type === 'group' && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {chat.members} members
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-4 ${message.senderId === 'user123' ? 'flex-row-reverse' : ''}`}>
          {message.senderId !== 'user123' && (
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={message.senderAvatar} />
              <AvatarFallback>{message.senderName[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className={`flex-1 max-w-[70%] ${message.senderId === 'user123' ? 'text-right' : ''}`}>
            {message.senderId !== 'user123' && selectedChatData?.type === 'group' && (
              <p className="text-sm font-medium text-muted-foreground mb-1">{message.senderName}</p>
            )}
            <div className={`rounded-lg p-4 ${
              message.senderId === 'user123'
                ? 'bg-accent text-accent-foreground ml-auto'
                : message.type === 'quote'
                ? 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500'
                : 'bg-muted'
            }`}>
              <p className={`leading-relaxed ${message.type === 'quote' ? 'italic' : ''}`}>
                {message.content}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{message.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background border-l border-border">
      {/* Chat List */}
      <div className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
          {renderChatList()}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-4 p-6 border-b border-border bg-card">
            <Avatar className="w-12 h-12">
              <AvatarImage src={selectedChatData?.avatar} />
              <AvatarFallback>{selectedChatData?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedChatData?.name}</h3>
              {selectedChatData?.type === 'group' ? (
                <p className="text-sm text-muted-foreground">{selectedChatData.members} members • Active now</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedChatData?.isOnline ? 'Online' : 'Last seen 2h ago'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedChatData?.type === 'direct' && (
                <>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-auto custom-scrollbar bg-background/50">
            {renderMessages()}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-border bg-card">
            <div className="flex items-end gap-3">
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="min-h-[44px] max-h-[120px] resize-none"
                  rows={1}
                />
              </div>
              <Button 
                onClick={sendMessage} 
                disabled={!messageInput.trim()}
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* No chat selected */
        <div className="flex-1 flex items-center justify-center text-muted-foreground bg-background/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 