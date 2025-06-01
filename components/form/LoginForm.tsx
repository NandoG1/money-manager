// LoginForm.tsx
"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { motion } from "framer-motion";
import { DollarSign, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { useToast } from "../ui/use-toast";

const BACKGROUND_ANIMATION = {
  background: [
    "linear-gradient(45deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
    "linear-gradient(225deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
    "linear-gradient(315deg, #1e293b 0%, #0f172a 50%, #334155 100%)",
  ],
};

const BACKGROUND_TRANSITION = {
  duration: 8,
  repeat: Infinity,
  repeatType: "reverse" as const,
};

const FLOATING_ANIMATION = {
  y: [0, -10, 0],
};

const FLOATING_TRANSITION = {
  duration: 4,
  repeat: Infinity,
};

const LOGO_ROTATION = {
  rotate: [0, 360],
};

const LOGO_ROTATION_TRANSITION = {
  duration: 20,
  repeat: Infinity,
  ease: "linear" as const,
};

const LOGO_SCALE_ANIMATION = {
  scale: [1, 1.2, 1],
};

const LOGO_SCALE_TRANSITION = {
  duration: 2,
  repeat: Infinity,
};

const TEXT_ANIMATION = {
  backgroundPosition: ["0%", "100%", "0%"],
};

const TEXT_TRANSITION = {
  duration: 5,
  repeat: Infinity,
};

const TESTIMONIAL_GLOW = {
  boxShadow: [
    "0 0 20px rgba(16, 185, 129, 0.2)",
    "0 0 40px rgba(16, 185, 129, 0.4)",
    "0 0 20px rgba(16, 185, 129, 0.2)"
  ],
};

const TESTIMONIAL_GLOW_TRANSITION = {
  duration: 3,
  repeat: Infinity,
};

const BUTTON_SHINE_ANIMATION = {
  x: [-200, 200],
  opacity: [0, 1, 0],
};

const BUTTON_SHINE_TRANSITION = {
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut" as const,
  repeatDelay: 1,
};

const BUTTON_SCALE_ANIMATION = {
  scale: [1, 1.05, 1],
  opacity: [0.3, 0.6, 0.3],
};

const BUTTON_SCALE_TRANSITION = {
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const BUTTON_BORDER_ANIMATION = {
  boxShadow: [
    "0 0 0px rgba(255,255,255,0)",
    "0 0 20px rgba(255,255,255,0.3)",
    "0 0 0px rgba(255,255,255,0)"
  ],
};

const BUTTON_BORDER_TRANSITION = {
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const ARROW_ANIMATION = {
  x: [0, 5, 0],
};

const ARROW_TRANSITION = {
  duration: 1.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const SPINNER_ANIMATION = {
  rotate: 360,
};

const SPINNER_TRANSITION = {
  duration: 1,
  repeat: Infinity,
  ease: "linear" as const,
};

const INPUT_GLOW_ANIMATION = {
  boxShadow: [
    "0 0 0px rgba(16, 185, 129, 0)",
    "0 0 20px rgba(16, 185, 129, 0.3)",
    "0 0 0px rgba(16, 185, 129, 0)"
  ],
};

const INPUT_GLOW_TRANSITION = {
  duration: 2,
  repeat: Infinity,
};

const SECONDARY_BUTTON_ANIMATION = {
  opacity: [0, 0.5, 0],
};

const SECONDARY_BUTTON_TRANSITION = {
  duration: 2,
  repeat: Infinity,
};

const AnimatedBackground = memo(() => (
  <motion.div
    className="absolute inset-0"
    animate={BACKGROUND_ANIMATION}
    transition={BACKGROUND_TRANSITION}
  />
));

AnimatedBackground.displayName = 'AnimatedBackground';

const FloatingOrbs = memo(({ staticAnimationData }: { staticAnimationData: any }) => {
  const orbAnimations = useMemo(() => ({
    x: [0, 100, 0],
    y: [0, -100, 0],
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {staticAnimationData.orbPositions.map((orb: any, i: number) => (
        <motion.div
          key={`stable-orb-${i}`}
          className="absolute rounded-full opacity-20"
          style={{
            background: `linear-gradient(45deg, ${i % 2 === 0 ? '#10b981' : '#06b6d4'}, ${i % 2 === 0 ? '#059669' : '#0891b2'})`,
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${orb.left}%`,
            top: `${orb.top}%`,
          }}
          animate={orbAnimations}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: "reverse" as const,
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
});

FloatingOrbs.displayName = 'FloatingOrbs';

const AnimatedParticles = memo(({ staticAnimationData }: { staticAnimationData: any }) => {
  const particleAnimation = useMemo(() => ({
    y: [-20, -100],
    opacity: [0, 1, 0],
  }), []);

  const particleTransition = useMemo(() => ({
    duration: 3,
    repeat: Infinity,
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {staticAnimationData.particlePositions.map((particle: any, i: number) => (
        <motion.div
          key={`stable-particle-${i}`}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={particleAnimation}
          transition={{
            ...particleTransition,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
});

AnimatedParticles.displayName = 'AnimatedParticles';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();

  const staticAnimationData = useMemo(() => ({
    orbPositions: Array.from({ length: 6 }, (_, i) => ({
      left: 10 + i * 15,
      top: 10 + i * 10,
      delay: i * 2,
      duration: 15 + i * 2
    })),
    particlePositions: Array.from({ length: 20 }, (_, i) => ({
      left: (i * 7 + 10) % 90,
      top: (i * 11 + 15) % 80,
      delay: i * 0.2
    }))
  }), []);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await signIn("credentials", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
        rememberMe,
      });

      if (res?.status !== 200) {
        toast({
          description: "Invalid Account",
          variant: "destructive",
        });
        setSubmitting(false);
      } else {
        router.refresh();
        router.replace("/dashboard");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }, [formData.email, formData.password, rememberMe, toast, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  }, []);
  
  const handleCheckboxChange = useCallback((checked: boolean) => {
    setRememberMe(checked);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const navigateToLanding = useCallback(() => {
    router.push("/landing");
  }, [router]);

  return (
    <div className="min-h-screen w-screen m-0 p-0 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingOrbs staticAnimationData={staticAnimationData} />
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
      
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Enhanced Branding */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative"
        >
          <AnimatedParticles staticAnimationData={staticAnimationData} />

          <motion.div
            animate={FLOATING_ANIMATION}
            transition={FLOATING_TRANSITION}
            className="flex items-center gap-3 mb-12"
          >
            <motion.div
              animate={LOGO_ROTATION}
              transition={LOGO_ROTATION_TRANSITION}
              className="relative"
            >
              <DollarSign className="h-10 w-10 text-emerald-400" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                animate={LOGO_SCALE_ANIMATION}
                transition={LOGO_SCALE_TRANSITION}
              />
            </motion.div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FTRAKT
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
                Welcome back to
              </span>
              <br />
              <motion.span
                animate={TEXT_ANIMATION}
                transition={TEXT_TRANSITION}
                className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_100%]"
              >
                FTRAKT Money Manager
              </motion.span>
            </h1>
            <p className="text-gray-300 mb-12 text-xl leading-relaxed">
              Sign in to continue your journey to financial freedom. Track your expenses, 
              manage your budget, and achieve your financial goals with style.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={TESTIMONIAL_GLOW}
              transition={TESTIMONIAL_GLOW_TRANSITION}
              className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-emerald-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <p className="italic text-gray-300 text-lg">
                  Money Manager has transformed how I handle my finances. The insights are invaluable!
                </p>
              </div>
              <div className="flex items-center">
                <motion.div
                  animate={LOGO_ROTATION}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg"
                >
                  JD
                </motion.div>
                <div className="ml-4">
                  <p className="font-semibold text-white">John Doe</p>
                  <p className="text-sm text-emerald-300">Product Designer</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Enhanced Login Form */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold mb-3 text-white">Sign in to your account</h2>
              <p className="text-gray-400 text-lg">Enter your credentials to access your account</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-emerald-400 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-12 h-14 bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-gray-500 hover:border-emerald-500/50 focus:border-emerald-400 transition-all duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-md border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 pointer-events-none"
                    animate={INPUT_GLOW_ANIMATION}
                    transition={INPUT_GLOW_TRANSITION}
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-2"
              >
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                  <Link href="#" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-emerald-400 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-12 h-14 bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-gray-500 hover:border-emerald-500/50 focus:border-emerald-400 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <motion.div
                    className="absolute inset-0 rounded-md border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 pointer-events-none"
                    animate={INPUT_GLOW_ANIMATION}
                    transition={INPUT_GLOW_TRANSITION}
                  />
                </div>
              </motion.div>

              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onCheckedChange={handleCheckboxChange}
                  className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me for 30 days
                </label>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold text-lg relative overflow-hidden group transition-all duration-300"
                  disabled={submitting}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={BUTTON_SHINE_ANIMATION}
                    transition={BUTTON_SHINE_TRANSITION}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 via-cyan-300/30 to-emerald-300/30"
                    animate={BUTTON_SCALE_ANIMATION}
                    transition={BUTTON_SCALE_TRANSITION}
                  />
                  {/* Pulsing border effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-white/20 rounded-md"
                    animate={BUTTON_BORDER_ANIMATION}
                    transition={BUTTON_BORDER_TRANSITION}
                  />
                  <span className="relative z-10 flex items-center justify-center">
                    {submitting ? (
                      <>
                        <motion.div
                          animate={SPINNER_ANIMATION}
                          transition={SPINNER_TRANSITION}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <motion.div
                          animate={ARROW_ANIMATION}
                          transition={ARROW_TRANSITION}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-full justify-center"
                >
                  <p className="mt-4 w-fit rounded-md bg-red-500/90 px-4 py-2 font-semibold text-white shadow-lg">
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-4 text-gray-400 font-medium">Or continue with</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button" 
                  className="w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold relative overflow-hidden group"
                  onClick={navigateToLanding}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
                    animate={SECONDARY_BUTTON_ANIMATION}
                    transition={SECONDARY_BUTTON_TRANSITION}
                  />
                  <ArrowRight className="mr-2 h-5 w-5 relative z-10" />
                  <span className="relative z-10">Continue to Landing Page</span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-8"
              >
                <p className="text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;