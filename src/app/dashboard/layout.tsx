"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Users,
  CheckSquare,
  FileText,
  Mic,
  FileSearch,
  LogOut,
  User,
  Menu,
  X,
  Home,
} from "lucide-react"
import { UserProfileProvider, useUserProfile } from "@/contexts/UserProfileContext"
import { DashboardThemeProvider, useDashboardTheme } from "@/contexts/DashboardThemeContext"
import { DashboardThemeSelector } from "@/components/DashboardThemeSelector"

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    name: "To Do",
    href: "/dashboard/todo",
    icon: CheckSquare,
  },
  {
    name: "Loan Application",
    href: "/dashboard/loan-application",
    icon: FileText,
  },
  {
    name: "Voice AI",
    href: "/dashboard/voice-ai",
    icon: Mic,
  },
  {
    name: "Documents AI",
    href: "/dashboard/documents-ai",
    icon: FileSearch,
  },
]

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile } = useUserProfile()
  const { themeStyles } = useDashboardTheme()

  const handleLogout = () => {
    // Add logout logic here
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300" style={themeStyles}>
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border fixed top-0 left-0 right-0 z-20 transition-colors duration-300">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold text-foreground">BrokerBud</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-10 w-64 bg-card border-r border-border
            transform transition-transform duration-200 ease-in-out lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            mt-16 lg:mt-0
          `}
        >
          <nav className="h-[calc(100vh-4rem)] lg:h-screen overflow-y-auto p-4 flex flex-col">
            <div className="space-y-1 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Section */}
            <div className="pt-4 border-t border-border space-y-3 mt-4">
              <DashboardThemeSelector />

              <div className="flex items-center space-x-2 px-4 py-2">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {profile?.user_email || 'Loading...'}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-0 lg:hidden mt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 px-6 lg:px-8 pb-6 lg:pb-8 overflow-auto bg-background">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProfileProvider>
      <DashboardThemeProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </DashboardThemeProvider>
    </UserProfileProvider>
  )
}
