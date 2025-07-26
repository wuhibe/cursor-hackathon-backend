import React from "react"
import {
  Home,
  Users,
  MessageCircle,
  User,
  Book,
  Bell,
  BookOpen,
  PlusCircle,
  Search,
  Settings,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function Header() {
  const navItems = [
    { id: "/", label: "Home", icon: Home },
    { id: "groups", label: "Groups", icon: Users },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: 3 },
    { id: "book", label: "Books", icon: Book },
    { id: "profile", label: "Profile", icon: User },
    
  ]
  // For demo, static activeScreen
  const activeScreen = "feed"
  const onScreenChange = (id: string) => {
    // Implement navigation logic here
    // e.g., router.push or set state
  }
  return (
    <header className=" right-0 h-16 bg-white/80 border-b border-border z-30 flex flex-col items-center justify-between px-8">
      {/* Logo & Nav */}
      <div className="flex items-center gap-8 h-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold">Booksy</span>
        </div>
        {/* Navigation */}
        <nav className="flex gap-2 ml-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative font-medium text-sm
                  ${activeScreen === item.id
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      {/* Search & Actions */}
     
    </header>
  )
}
