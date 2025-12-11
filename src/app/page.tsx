

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Briefcase,
  Clock,
  TrendingUp,
  Star,
  Shield,
  CheckCircle,
  Users,
  FileText,
  Sparkles,
  BarChart3,
  Lock,
  ListTodo,
} from "lucide-react"
import { ThemeSelector } from "@/components/ThemeSelector"
import { BackgroundSelector } from "@/components/BackgroundSelector"
// import { BackgroundRenderer } from "@/components/BackgroundRenderer"
import { AnimatedGridBackground } from "@/components/AnimatedGridBackground"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-[#00ff88] selection:text-black">
      <AnimatedGridBackground />
      {/* <BackgroundRenderer /> */}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full relative">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-primary">DealTrack</span>
            </Link>
            <div className="flex items-center space-x-3">
              {/* <BackgroundSelector /> */}
              {/* <ThemeSelector /> */}
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-2 border-primary">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary">
                <Link href="/login?mode=register">Register</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 relative z-10">
          {/* Hero Section */}
          <section className="relative pt-12 pb-12 md:pt-16 md:pb-16">
            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center text-center space-y-10 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-foreground">Welcome to</span>
                  <br />
                  <span className="text-primary block mt-4">DealTrack</span>
                  <br />
                  <span className="text-lg md:text-xl lg:text-2xl font-semibold text-primary mt-4 block">AI - Powered Document Analysis for Mortgage Brokers</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  From Lead Management to Loan Applications, DealTrack streamlines your entire business process.
                  Focus on what you do best, we&apos;ll handle the rest.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 pt-2">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                    <Link href="/login?mode=register">Get Started Free</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-4 pt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>24/7 support</span>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Features Section */}
          <section id="features" className="py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">Key Features</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Everything you need to run your mortgage brokerage efficiently and profitably.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Lead Management</h3>
                    <p className="text-muted-foreground">
                      Track and manage your leads effectively with comprehensive tools for lead tracking, qualification, and conversion.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Loan Applications</h3>
                    <p className="text-muted-foreground">
                      Streamline loan application processing with automated workflows and document management.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">AI-Powered Tools</h3>
                    <p className="text-muted-foreground">
                      Leverage AI for document processing, voice analysis, and intelligent insights to boost productivity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Analytics & Reports</h3>
                    <p className="text-muted-foreground">
                      Get comprehensive business insights with detailed analytics and performance reports.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Secure & Compliant</h3>
                    <p className="text-muted-foreground">
                      Enterprise-grade security with encrypted data storage and full compliance with regulations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <ListTodo className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Task Management</h3>
                    <p className="text-muted-foreground">
                      Keep track of daily tasks and activities with an integrated to-do system.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="py-20">
            <div className="container px-4 md:px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Why Choose DealTrack?</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">Save Time & Increase Efficiency</h3>
                        <p className="text-muted-foreground">
                          Automate repetitive tasks and streamline your workflow to focus on growing your business.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">Boost Revenue</h3>
                        <p className="text-muted-foreground">
                          Faster processing, better organization, and improved customer service lead to increased profits.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">Stay Compliant</h3>
                        <p className="text-muted-foreground">
                          Built-in compliance features ensure you meet all industry regulations and requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Our Customers Say</h2>
                <p className="text-xl text-muted-foreground">
                  Trusted by mortgage brokers worldwide
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border border-border shadow-lg bg-card">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      &quot;DealTrack has transformed our business operations. We&apos;ve reduced processing time by 60% and our
                      customers love the professional service.&quot;
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border shadow-lg bg-card">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      &quot;The lead management feature is incredibly powerful. It&apos;s saved us countless hours and helped
                      us close more deals.&quot;
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border shadow-lg bg-card">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      &quot;Excellent customer support and the analytics help us make better business decisions. Highly
                      recommended!&quot;
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 border-t border-border">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Transform Your Business?</h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of mortgage brokers that trust DealTrack to streamline their operations.
                </p>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/dashboard">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted/10 backdrop-blur-sm border-t border-border py-12">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">DealTrack</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Streamlining mortgage brokerage businesses with innovative technology solutions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-foreground">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#features" className="hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-12 pt-8 text-center">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DealTrack. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
