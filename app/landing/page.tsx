"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ParticleBackground } from "@/components/ui/particles"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  DollarSign,
  ArrowRight,
  BarChart4,
  Wallet,
  LineChart,
  Sparkles,
  Target,
  Lock,
  Box,
  Settings
} from "lucide-react"

import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import {TextGenerateEffect2} from "@/components/ui/text-generate-effect2"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { TracingBeam } from "@/components/ui/tracing-beam"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import {useRouter} from "next/navigation"
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

import { SparklesCore } from "@/components/ui/sparkles"
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect"
import { useScroll, useTransform } from "motion/react";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

const testimonials = [
  {
    quote: "Money Manager has completely changed how I track my finances. The visualizations make it easy to spot trends and adjust my spending habits.",
    name: "Sarah Johnson",
    designation: "Small Business Owner",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "I've tried many finance apps, but this one finally helped me stick to a budget. The insights feature is a game-changer for financial planning.",
    name: "Michael Chen",
    designation: "Software Engineer",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "The budget tracking tools helped me save for my dream vacation in just 6 months. I can finally see where every dollar goes!",
    name: "Jessica Martinez",
    designation: "Marketing Manager",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]

const features = [
  {
    icon: <BarChart4 className="h-10 w-10" />,
    title: "AI-Powered Analytics",
    description: "Intelligent insights that analyze your spending patterns and suggest optimization strategies",
    gradientClass: "from-violet-500 to-purple-600",
    iconBgClass: "bg-gradient-to-br from-violet-500 to-purple-600",
    delay: 0,
  },
  {
    icon: <Wallet className="h-10 w-10" />,
    title: "Smart Budgeting",
    description: "Adaptive budget recommendations based on your income, goals, and spending history",
    gradientClass: "from-blue-500 to-cyan-600",
    iconBgClass: "bg-gradient-to-br from-blue-500 to-cyan-600",
    delay: 0.1,
  },
  {
    icon: <Lock className="h-10 w-10" />,
    title: "Bank-Level Security",
    description: "Enterprise-grade encryption and security protocols to protect your financial data",
    gradientClass: "from-emerald-500 to-teal-600",
    iconBgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
    delay: 0.2,
  },
]

const steps = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Connect Your Accounts",
    description: "Securely link your financial accounts for a comprehensive overview of your finances",
    gradientClass: "from-pink-500 to-rose-600",
    iconBgClass: "bg-gradient-to-br from-pink-500 to-rose-600",
    delay: 0,
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Visualize Your Finances",
    description: "Interactive charts and reports that make understanding your money intuitive and insightful",
    gradientClass: "from-amber-500 to-orange-600",
    iconBgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
    delay: 0.1,
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Achieve Your Goals",
    description: "Set financial targets and track your progress with personalized recommendations",
    gradientClass: "from-emerald-500 to-teal-600",
    iconBgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
    delay: 0.2,
  },
]

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  return (
    <li className="min-h-[14rem] list-none">
      <div className="relative h-full rounded-2xl border border-gray-700 shadow-[0px_0px_27px_0px_#2D2D2D] p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-gray-800 bg-black p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="flex flex-col gap-3">
              <div className="w-fit rounded-lg border border-gray-600 p-2">
                {icon}
              </div>
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
            </div>
            <div>
              <h2 className="font-sans text-sm/[1.125rem] text-gray-400 md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
 
    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
 
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

const content = [
  {
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Collaborative Editing
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Version control",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
        Version control
      </div>
    ),
  },
  {
    title: "Running out of content",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Running out of content
      </div>
    ),
  },
];

export default function LandingPage() {

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
 
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const featuresRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)
  const router = useRouter()

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

   const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "How it Work",
      link: "#how-it-works",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
  ];
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-black scroll-smooth">
      <TracingBeam className="z-[1000]">
      <ParticleBackground />

      {/* <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">FTRAKT</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection(featuresRef)} className="hover:text-emerald-400 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-emerald-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection(testimonialsRef)} className="hover:text-emerald-400 transition-colors">
            Testimonials
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:text-emerald-400 transition-all">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </header> */}

      <Navbar className="scroll-smooth">
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" onClick={() => router.push("/login")}>Login</NavbarButton>
            <NavbarButton variant="primary" onClick={() => router.push("/register")}>Get Started</NavbarButton>
          </div>
        </NavBody>
 
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>



      <main className="relative z-10">
        <section className="py-20 px-4 max-w-6xl mx-auto text-center mt-20">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Transform Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
              Finances
            </span>{" "}
            with Smart Management
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Track spending, create budgets, and gain valuable insights into your financial habits. Take control of your
            money today.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-8 py-6 text-lg">
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <button
              onClick={() => scrollToSection(howItWorksRef)}
              className="inline-flex items-center justify-center whitespace-nowrap border border-white/20 hover:bg-white/10 px-8 py-6 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              See How It Works
            </button>
          </motion.div>

          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-700/20 rounded-xl p-1">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
                <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <img
                  src="assets/landing-page.jpg"
                  alt="Money Manager Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>


        </section>

        <section id="features" ref={featuresRef} className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 mb-4">
                  Powerful Features
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 mt-5 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Everything You <span className="ml-2"><PointerHighlight>Need</PointerHighlight></span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Cutting-edge tools designed to transform how you manage, track, and grow your finances
              </motion.p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/80 to-black/80 p-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}
                  />
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className={`mb-6 p-3 rounded-xl ${feature.iconBgClass} w-fit`}>{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 group-hover:text-white/90 transition-colors">{feature.description}</p>
                    <div className="mt-auto pt-6 flex items-center text-sm font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div> */}

            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <GridItem
                icon={<Box className="h-4 w-4 text-green-400 dark:text-neutral-400" />}
                title="AI - Powered Anayltics."
                description="Intelligent insights that analyze your spending patterns and suggest optimization strategies"
              />
              <GridItem
                icon={<Settings className="h-4 w-4 text-green-400 dark:text-neutral-400" />}
                title="Smart Budgeting."
                description="Adaptive budget recommendations based on your income, goals, and spending history"
              />
              <GridItem
                icon={<Lock className="h-4 w-4 text-green-400 dark:text-neutral-400" />}
                title="Login - Register Security."
                description="Enterprise-grade encryption and security protocols to protect your financial data and your account"
              />
           </ul>


          </div>
        </section>

        <section id="how-it-works" ref={howItWorksRef} className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/10 to-black -z-10"></div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 mb-4">
                  Simple Process
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 mt-5 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                How It <span className="ml-2"><PointerHighlight>Works</PointerHighlight></span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Three simple steps to transform your financial future
              </motion.p>
            </div>

            <div className="relative py-10">
              {/* Animated connecting line */}
              <motion.div 
                className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-amber-500 to-emerald-500 transform -translate-y-1/2 hidden md:block z-0"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
              />
              
              {/* Animated dots on the line */}
              <div className="hidden md:flex justify-between absolute top-1/2 left-[16%] right-[16%] transform -translate-y-1/2 z-10">
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={`dot-${i}`}
                    className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.2 }}
                    viewport={{ once: true }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 mt-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 h-full group-hover:translate-y-[-5px]">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 -z-10"
                        style={{ background: step.gradientClass }}
                      />
                      
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${step.iconBgClass} shadow-lg transform transition-transform group-hover:scale-110 duration-500`}>
                          <motion.div
                            animate={{ 
                              boxShadow: ["0 0 0 0px rgba(255,255,255,0)", "0 0 0 10px rgba(255,255,255,0)"] 
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              repeatType: "loop", 
                              ease: "easeInOut" 
                            }}
                            className="absolute inset-0 rounded-2xl"
                          />
                          {step.icon}
                        </div>
                      </div>
                      
                      <motion.h3 
                        className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-emerald-300 group-hover:to-white transition-all duration-500"
                      >
                        {step.title}
                      </motion.h3>
                      <p className="text-gray-300 group-hover:text-white transition-colors duration-500">
                        {step.description}
                      </p>
                      
                      <div className="mt-6 flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-0 group-hover:translate-x-2">
                        <span className="text-sm font-medium">Get started</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-200 text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] z-20 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>



          </div>
        </section>

        <section id="testimonials" ref={testimonialsRef} className="py-20 px-4 relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 mb-4">
                  Testimonials
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 mt-5 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                What Our <span className="ml-2 mr-2"><PointerHighlight>Users</PointerHighlight></span> Says
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of satisfied users who have transformed their financial lives
              </motion.p>
            </div>

            <AnimatedTestimonials testimonials={testimonials} />

            {/* <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/50 p-1">
                          <img
                            src={testimonials[currentTestimonial].avatar || "/next.svg"}
                            alt={testimonials[currentTestimonial].author}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xl mb-6 italic text-gray-200">{testimonials[currentTestimonial].text}</p>
                        <div>
                          <p className="font-bold text-lg">{testimonials[currentTestimonial].author}</p>
                          <p className="text-emerald-400">{testimonials[currentTestimonial].role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -left-4 text-4xl text-emerald-500 opacity-50">-</div>
                  <div className="absolute -bottom-4 -right-4 text-4xl text-emerald-500 opacity-50">-</div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4 z-20">
                <button
                  onClick={() =>
                    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-emerald-500/20 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-emerald-500/20 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div> */}

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? "bg-emerald-400 w-8" : "bg-white/30 hover:bg-white/50"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </section>
        
        
        
{/* 
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-12 rounded-2xl backdrop-blur-md border border-emerald-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have already taken control of their financial future
            </p>

            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-8 py-6 text-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section> */}

        <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
          {/* <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
            FinTrack
          </h1> */}

          <section className="pt-20 px-4 z-20">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-12 rounded-2xl backdrop-blur-md border border-emerald-500/20">
              <TextGenerateEffect words="Ready to Transform Your Finances?" className="text-3xl md:text-4xl font-bold mb-6 text-white" />
              <TextGenerateEffect2 words="Join thousands of users who have already taken control of their financial future" className="text-xl text-gray-300 mb-8" />

              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-8 py-6 text-lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {/* <div className="m-40 flex justify-center text-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="text-white bg-black flex items-center space-x-2"
                  >
                    <span>Get Started Now</span>
                  </HoverBorderGradient>
                </div> */}
              </Link>
            </div>
          </section>

          <div className="w-[40rem] h-40 relative z-10">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
    
            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
    
            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
        
      </main>
      
      </TracingBeam>

      <footer className="relative z-10 py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold">FTRAKT</span>
            </div>
            <p className="text-gray-400">Your personal financial companion for smart money management.</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => scrollToSection(featuresRef)} className="hover:text-emerald-400">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-emerald-400">
                  How It Works
                </button>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
          
          {/* <div className="mt-8 md:mt-0 flex justify-center md:justify-end items-end md:w-1/4">
            <FloatingDock 
              // only for demo, remove for production
              items={links}
            />
          </div> */}


        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Money Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
