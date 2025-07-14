"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Image, MessageSquare, Shield } from "lucide-react";
import { fadeIn, staggerContainer, textVariant } from "@/lib/motion";
import NextImage from "next/image";
import React from "react";
import { GradientBackground } from "@/components/Gradient-Background";
import { HomeImg } from "@/assets";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-foreground/60 transition-colors hover:text-foreground/80"
    >
      {children}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export default function LandingPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect with Friends",
      description:
        "Stay in touch with your friends and family no matter where they are in the world.",
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "Share Moments",
      description:
        "Share your favorite moments through photos, videos, and stories with your network.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Real-time Chat",
      description:
        "Message your connections instantly with our fast and reliable messaging system.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description:
        "Your data is yours. We prioritize your privacy and give you control over your information.",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      handle: "@alexj",
      avatar: "/avatars/alex.jpg",
      content:
        "This platform changed how I connect with my friends and family. Highly recommended!",
    },
    {
      name: "Taylor Swift",
      handle: "@taylorswift",
      avatar: "/avatars/taylor.jpg",
      content:
        "Love how easy it is to share my music journey with my fans here.",
    },
    {
      name: "Chris Evans",
      handle: "@cevans",
      avatar: "/avatars/chris.jpg",
      content:
        "Finally a social network that puts users first. The interface is clean and intuitive.",
    },
  ];

  return (
    <GradientBackground blurIntensity="strong">
      <div className="relative min-h-screen">
        {/* Navigation */}
        <header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <motion.div
            className="container flex h-16 items-center justify-between"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-xl font-bold text-transparent">
                SocialApp
              </span>
            </motion.div>

            <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
              <motion.div
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink href="#features">Features</NavLink>
              </motion.div>

              <motion.div
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink href="#testimonials">Testimonials</NavLink>
              </motion.div>

              <motion.div
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink href="#cta">Get Started</NavLink>
              </motion.div>
            </nav>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </header>

        <main className="mt-20 flex-1">
          {/* Hero Section */}
          <motion.section
            className="container flex flex-col items-center justify-center space-y-6 py-20 md:py-32"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer()}
          >
            <div className="container flex max-w-6xl flex-col items-center gap-6 text-center">
              <motion.h1
                className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
                variants={textVariant(0.1)}
              >
                Connect with Friends,{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Share Your World
                </span>
              </motion.h1>

              <motion.p
                className="max-w-2xl text-xl leading-relaxed text-muted-foreground"
                variants={textVariant(0.2)}
              >
                Join millions of people sharing their stories, thoughts, and
                moments with friends and family.
              </motion.p>

              <motion.div
                className="mt-6 flex flex-wrap justify-center gap-4"
                variants={textVariant(0.3)}
              >
                <Button size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="#features">Learn more</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="mt-16 w-full max-w-5xl"
              variants={fadeIn("up", "spring", 0.5, 1)}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/50 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background/20 to-background/80" />
                {/* Add your screenshot or illustration here */}
                <NextImage
                  src={HomeImg.src}
                  alt="Home"
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            id="features"
            className="py-20 md:py-32"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer()}
          >
            <div className="container mx-auto max-w-7xl px-4">
              <motion.div
                className="mx-auto mb-16 max-w-3xl text-center"
                variants={fadeIn("up", "spring", 0.1, 1)}
              >
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Amazing Features
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Discover what makes our platform the best place to connect
                  with your loved ones.
                </p>
              </motion.div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn("up", "spring", 0.2 + index * 0.1, 1)}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <Card className="h-full border-border/50 bg-background/50 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg">
                      <CardHeader>
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20">
                          {React.cloneElement(feature.icon, {
                            className: "h-6 w-6",
                          })}
                        </div>
                        <CardTitle className="mt-4 text-xl font-semibold">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Testimonials */}
          <motion.section
            id="testimonials"
            className="relative overflow-hidden py-20 md:py-32"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer()}
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-muted/20" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="container relative mx-auto px-4">
              <motion.div
                className="mx-auto mb-16 max-w-3xl text-center"
                variants={fadeIn("up", "spring", 0.1, 1)}
              >
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Loved by Many
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Join thousands of happy users who have found their community
                  with us.
                </p>
              </motion.div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn("up", "spring", 0.2 + index * 0.1, 1)}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="mb-6 flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/20 transition-all duration-300 group-hover:border-primary/50">
                            <AvatarImage src={testimonial.avatar} />
                            <AvatarFallback className="bg-primary/10">
                              {testimonial.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.handle}
                            </p>
                          </div>
                        </div>
                        <p className="relative pl-4 italic text-muted-foreground before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-primary/50 before:content-['']">
                          {testimonial.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            id="cta"
            className="relative overflow-hidden py-20 md:py-32"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer()}
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="container relative mx-auto px-4">
              <motion.div
                className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 backdrop-blur-sm md:p-12"
                variants={fadeIn("up", "spring", 0.1, 1)}
              >
                <div className="text-center">
                  <motion.h2
                    className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                    variants={textVariant(0.1)}
                  >
                    Ready to get started?
                  </motion.h2>
                  <motion.p
                    className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
                    variants={textVariant(0.2)}
                  >
                    Join our community today and start connecting with people
                    who matter most.
                  </motion.p>
                  <motion.div
                    className="mt-8 flex flex-wrap justify-center gap-4"
                    variants={textVariant(0.3)}
                  >
                    <Button
                      size="lg"
                      className="px-8 py-6 text-lg font-medium transition-all hover:scale-105 hover:shadow-lg"
                      asChild
                    >
                      <Link href="/signup">Create Account</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-lg font-medium"
                      asChild
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} SocialApp. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cookies
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </GradientBackground>
  );
}
