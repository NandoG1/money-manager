"use client";

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import Link from "next/link";
import { motion } from "framer-motion";
import { DollarSign, Mail, Lock, User, ArrowRight, Check, Eye, EyeOff, Sparkles, KeyRound } from "lucide-react";

const BACKGROUND_ANIMATION = {
  background: [
    "linear-gradient(45deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
    "linear-gradient(225deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
    "linear-gradient(315deg, #1e293b 0%, #0f172a 50%, #334155 100%)",
  ],
};
const BACKGROUND_TRANSITION = { duration: 8, repeat: Infinity, repeatType: "reverse" as const };
const FLOATING_ANIMATION = { y: [0, -10, 0] };
const FLOATING_TRANSITION = { duration: 4, repeat: Infinity };
const LOGO_ROTATION = { rotate: [0, 360] };
const LOGO_ROTATION_TRANSITION = { duration: 20, repeat: Infinity, ease: "linear" as const };
const LOGO_SCALE_ANIMATION = { scale: [1, 1.2, 1] };
const LOGO_SCALE_TRANSITION = { duration: 2, repeat: Infinity };
const TEXT_ANIMATION = { backgroundPosition: ["0%", "100%", "0%"] };
const TEXT_TRANSITION = { duration: 5, repeat: Infinity };
const TESTIMONIAL_GLOW = { boxShadow: ["0 0 20px rgba(16, 185, 129, 0.2)", "0 0 40px rgba(16, 185, 129, 0.4)", "0 0 20px rgba(16, 185, 129, 0.2)"] };
const TESTIMONIAL_GLOW_TRANSITION = { duration: 3, repeat: Infinity };
const BUTTON_SHINE_ANIMATION = { x: [-200, 200], opacity: [0, 1, 0] };
const BUTTON_SHINE_TRANSITION = { duration: 2, repeat: Infinity, ease: "easeInOut" as const, repeatDelay: 1 };
const BUTTON_SCALE_ANIMATION = { scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] };
const BUTTON_SCALE_TRANSITION = { duration: 3, repeat: Infinity, ease: "easeInOut" as const };
const BUTTON_BORDER_ANIMATION = { boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"] };
const BUTTON_BORDER_TRANSITION = { duration: 2, repeat: Infinity, ease: "easeInOut" as const };
const ARROW_ANIMATION = { x: [0, 5, 0] };
const ARROW_TRANSITION = { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const };
const SPINNER_ANIMATION = { rotate: 360 };
const SPINNER_TRANSITION = { duration: 1, repeat: Infinity, ease: "linear" as const };
const INPUT_GLOW_ANIMATION = { boxShadow: ["0 0 0px rgba(16, 185, 129, 0)", "0 0 20px rgba(16, 185, 129, 0.3)", "0 0 0px rgba(16, 185, 129, 0)"] };
const INPUT_GLOW_TRANSITION = { duration: 2, repeat: Infinity };
const SECONDARY_BUTTON_ANIMATION = { opacity: [0, 0.5, 0] };
const SECONDARY_BUTTON_TRANSITION = { duration: 2, repeat: Infinity };


const AnimatedBackground = memo(() => ( <motion.div className="absolute inset-0" animate={BACKGROUND_ANIMATION} transition={BACKGROUND_TRANSITION} /> ));
AnimatedBackground.displayName = 'AnimatedBackground';

const FloatingOrbs = memo(({ staticAnimationData }: { staticAnimationData: any }) => {
  const orbAnimations = useMemo(() => ({ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1], rotate: [0, 180, 360] }), []);
  return ( <div className="absolute inset-0 overflow-hidden pointer-events-none"> {staticAnimationData.orbPositions.map((orb: any, i: number) => ( <motion.div key={`stable-orb-${i}`} className="absolute rounded-full opacity-20" style={{ background: `linear-gradient(45deg, ${i % 2 === 0 ? '#10b981' : '#06b6d4'}, ${i % 2 === 0 ? '#059669' : '#0891b2'})`, width: `${60 + i * 20}px`, height: `${60 + i * 20}px`, left: `${orb.left}%`, top: `${orb.top}%` }} animate={orbAnimations} transition={{ duration: orb.duration, repeat: Infinity, repeatType: "reverse" as const, delay: orb.delay }} /> ))} </div> );
});
FloatingOrbs.displayName = 'FloatingOrbs';

const AnimatedParticles = memo(({ staticAnimationData }: { staticAnimationData: any }) => {
  const particleAnimation = useMemo(() => ({ y: [-20, -100], opacity: [0, 1, 0] }), []);
  const particleTransition = useMemo(() => ({ duration: 3, repeat: Infinity }), []);
  return ( <div className="absolute inset-0 overflow-hidden"> {staticAnimationData.particlePositions.map((particle: any, i: number) => ( <motion.div key={`stable-particle-${i}`} className="absolute w-1 h-1 bg-emerald-400 rounded-full" style={{ left: `${particle.left}%`, top: `${particle.top}%` }} animate={particleAnimation} transition={{ ...particleTransition, delay: particle.delay }} /> ))} </div> );
});
AnimatedParticles.displayName = 'AnimatedParticles';


function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formStage, setFormStage] = useState<'register' | 'verifyOtp'>('register');
  const [otp, setOtp] = useState<string>("");
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [resendingOtp, setResendingOtp] = useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status: sessionStatus } = useSession();

  const staticAnimationData = useMemo(() => ({
    orbPositions: Array.from({ length: 6 }, (_, i) => ({ left: 10 + i * 15, top: 10 + i * 10, delay: i * 2, duration: 15 + i * 2 })),
    particlePositions: Array.from({ length: 20 }, (_, i) => ({ left: (i * 7 + 10) % 90, top: (i * 11 + 15) % 80, delay: i * 0.2 }))
  }), []);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  }, [sessionStatus, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);
  
  const handleCheckboxChange = useCallback((checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setFormData((prev) => ({ ...prev, agreeTerms: checked }));
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => { setShowPassword(prev => !prev); }, []);
  const navigateToLanding = useCallback(() => { router.push("/landing"); }, [router]);
  const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) { setOtp(value); }
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) { toast({ title: "Terms Required", description: "You must agree to the terms and privacy policy.", variant: "destructive" }); return; }
    if (formStage !== 'register') return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email.toLowerCase(), password: formData.password }),
      });
      if (!res.ok) {
        const errorMsg = await res.text(); 
        toast({ description: errorMsg || "Registration failed. Server returned an error.", variant: "destructive" });
        setSubmitting(false);
        return;
      }
      const msg = await res.json();
      setSubmitting(false);
      toast({ title: "Registration Successful!", description: msg.message || "OTP sent.", variant: "success" });
      setRegisteredEmail(formData.email.toLowerCase());
      setFormStage('verifyOtp');
      setOtp("");
    } catch (error: any) {
      setSubmitting(false);
      toast({ title: "Error", description: "Registration request failed. Please check your connection or try again.", variant: "destructive" });
      console.error("Registration error:", error);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast({ title: "Invalid OTP", description: "OTP must be 6 digits.", variant: "destructive" }); return; }

    try {
      setVerifyingOtp(true);
      const res = await fetch(`/api/auth/verify-otp`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp: otp }),
      });
      if (!res.ok) {
        const errorMsg = await res.text();
        toast({ description: errorMsg || "OTP verification failed. Server returned an error.", variant: "destructive" });
        setVerifyingOtp(false);
        return;
      }
      const msg = await res.json();
      setVerifyingOtp(false);
      toast({ title: "Verification Successful!", description: msg.message || "Email verified.", variant: "success" });
      router.push("/login");
    } catch (error: any) {
      setVerifyingOtp(false);
      toast({ title: "Error", description: "OTP verification request failed. Please check your connection or try again.", variant: "destructive" });
      console.error("OTP Verification error:", error);
    }
  };
  
  const handleResendOtp = async () => {
    if (!registeredEmail) { toast({ description: "Email not found for resending OTP.", variant: "destructive" }); return; }
    try {
      setResendingOtp(true);
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, name: formData.name || "Resend User", password: formData.password || "dummyPassword123" }),
      });
      if (!res.ok) {
        const errorMsg = await res.text();
        toast({ description: errorMsg || "Failed to resend OTP. Server returned an error.", variant: "destructive" });
        setResendingOtp(false);
        return;
      }
      const msg = await res.json();
      setResendingOtp(false);
      toast({ description: msg.message || "New OTP sent.", variant: "success" });
    } catch (error) {
      setResendingOtp(false);
      toast({ description: "Error resending OTP. Please check your connection or try again.", variant: "destructive" });
      console.error("Resend OTP error:", error);
    }
  };

  return (
    <div className="min-h-screen w-screen m-0 p-0 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingOrbs staticAnimationData={staticAnimationData} />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
      
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <motion.div 
          initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}
          className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative"
        >
          <AnimatedParticles staticAnimationData={staticAnimationData} />
          <motion.div animate={FLOATING_ANIMATION} transition={FLOATING_TRANSITION} className="flex items-center gap-3 mb-12">
            <motion.div animate={LOGO_ROTATION} transition={LOGO_ROTATION_TRANSITION} className="relative">
              <DollarSign className="h-10 w-10 text-emerald-400" />
              <motion.div className="absolute inset-0 rounded-full border-2 border-emerald-400/30" animate={LOGO_SCALE_ANIMATION} transition={LOGO_SCALE_TRANSITION} />
            </motion.div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">FTRAKT</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">Start Your</span><br />
              <motion.span animate={TEXT_ANIMATION} transition={TEXT_TRANSITION} className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_100%]">Financial Journey</motion.span>
            </h1>
            <p className="text-gray-300 mb-12 text-xl leading-relaxed">Join thousands of users who are taking control of their finances with FTRAKT. Track expenses, create budgets, and achieve your financial goals.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="space-y-6 max-w-md">
            <motion.div animate={TESTIMONIAL_GLOW} transition={TESTIMONIAL_GLOW_TRANSITION} className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3"><div className="bg-emerald-500/20 p-2 rounded-full mt-0.5"><Check className="h-4 w-4 text-emerald-400" /></div><div><h3 className="font-medium text-white">Track Your Spending</h3><p className="text-sm text-gray-400">Automatically categorize and monitor your expenses</p></div></div>
                <div className="flex items-start gap-3"><div className="bg-emerald-500/20 p-2 rounded-full mt-0.5"><Check className="h-4 w-4 text-emerald-400" /></div><div><h3 className="font-medium text-white">Create Smart Budgets</h3><p className="text-sm text-gray-400">Set realistic budgets based on your spending habits</p></div></div>
                <div className="flex items-start gap-3"><div className="bg-emerald-500/20 p-2 rounded-full mt-0.5"><Check className="h-4 w-4 text-emerald-400" /></div><div><h3 className="font-medium text-white">Get Financial Insights</h3><p className="text-sm text-gray-400">Receive personalized recommendations to improve your finances</p></div></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
          className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            {formStage === 'register' ? (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-white">Create your account</h2>
                  <p className="text-gray-400 text-lg">Fill in your details to get started</p>
                </motion.div>
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} onSubmit={handleRegisterSubmit} className="space-y-6">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200 font-medium">Full Name</Label>
                    <div className="relative group"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-emerald-400 transition-colors" /><Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="pl-12 h-14 bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-gray-500 hover:border-emerald-500/50 focus:border-emerald-400 transition-all duration-300" /><motion.div className="absolute inset-0 rounded-md border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 pointer-events-none" animate={INPUT_GLOW_ANIMATION} transition={INPUT_GLOW_TRANSITION} /></div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
                    <div className="relative group"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-emerald-400 transition-colors" /><Input id="email" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="pl-12 h-14 bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-gray-500 hover:border-emerald-500/50 focus:border-emerald-400 transition-all duration-300" /><motion.div className="absolute inset-0 rounded-md border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 pointer-events-none" animate={INPUT_GLOW_ANIMATION} transition={INPUT_GLOW_TRANSITION} /></div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="space-y-2">
                    <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                    <div className="relative group"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-emerald-400 transition-colors" /><Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} required className="pl-12 pr-12 h-14 bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-gray-500 hover:border-emerald-500/50 focus:border-emerald-400 transition-all duration-300" /><button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button><motion.div className="absolute inset-0 rounded-md border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 pointer-events-none" animate={INPUT_GLOW_ANIMATION} transition={INPUT_GLOW_TRANSITION} /></div>
                    <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                  </motion.div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-1" />
                    <label htmlFor="terms" className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">I agree to the <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Terms of Service</Link> and <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</Link></label>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold text-lg relative overflow-hidden group transition-all duration-300" disabled={submitting}>
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" animate={BUTTON_SHINE_ANIMATION} transition={BUTTON_SHINE_TRANSITION} />
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 via-cyan-300/30 to-emerald-300/30" animate={BUTTON_SCALE_ANIMATION} transition={BUTTON_SCALE_TRANSITION} />
                      <motion.div className="absolute inset-0 border-2 border-white/20 rounded-md" animate={BUTTON_BORDER_ANIMATION} transition={BUTTON_BORDER_TRANSITION} />
                      <span className="relative z-10 flex items-center justify-center">
                        {submitting ? (<><motion.div animate={SPINNER_ANIMATION} transition={SPINNER_TRANSITION} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2" />Creating account...</>) : (<>Create account<motion.div animate={ARROW_ANIMATION} transition={ARROW_TRANSITION}><ArrowRight className="ml-2 h-5 w-5" /></motion.div></>)}
                      </span>
                    </Button>
                  </motion.div>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-4 text-gray-400 font-medium">Or continue with</span></div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="button" className="w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold relative overflow-hidden group" onClick={navigateToLanding}>
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20" animate={SECONDARY_BUTTON_ANIMATION} transition={SECONDARY_BUTTON_TRANSITION} />
                      <ArrowRight className="mr-2 h-5 w-5 relative z-10" /><span className="relative z-10">Continue to Landing Page</span>
                    </Button>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-8">
                    <p className="text-gray-400">Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Sign in</Link></p>
                  </motion.div>
                </motion.form>
              </>
            ) : (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-white">Verify Your Email</h2>
                  <p className="text-gray-400 text-lg">An OTP has been sent to <span className="font-semibold text-emerald-400">{registeredEmail}</span>. Please enter it below.</p>
                </motion.div>
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="space-y-2">
                    <Label htmlFor="otp" className="text-gray-200 font-medium">One-Time Password (OTP)</Label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-emerald-400 transition-colors" />
                      <Input id="otp" name="otp" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={handleOtpChange} required maxLength={6} className="pl-12 h-14 bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-gray-500 hover:border-emerald-500/50 focus:border-emerald-400 transition-all duration-300 tracking-[0.3em] text-center" />
                      <motion.div className="absolute inset-0 rounded-md border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 pointer-events-none" animate={INPUT_GLOW_ANIMATION} transition={INPUT_GLOW_TRANSITION} />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold text-lg relative overflow-hidden group transition-all duration-300" disabled={verifyingOtp || otp.length !== 6 || resendingOtp}>
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" animate={BUTTON_SHINE_ANIMATION} transition={BUTTON_SHINE_TRANSITION} />
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 via-cyan-300/30 to-emerald-300/30" animate={BUTTON_SCALE_ANIMATION} transition={BUTTON_SCALE_TRANSITION} />
                      <motion.div className="absolute inset-0 border-2 border-white/20 rounded-md" animate={BUTTON_BORDER_ANIMATION} transition={BUTTON_BORDER_TRANSITION} />
                      <span className="relative z-10 flex items-center justify-center">
                        {verifyingOtp ? (<><motion.div animate={SPINNER_ANIMATION} transition={SPINNER_TRANSITION} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2" />Verifying...</>) : (<>Verify OTP<Check className="ml-2 h-5 w-5" /></>)}
                      </span>
                    </Button>
                  </motion.div>
                  <div className="text-center mt-4">
                    <Button type="button" variant="link" className="text-emerald-400 hover:text-emerald-300 disabled:text-gray-500 disabled:no-underline" onClick={handleResendOtp} disabled={resendingOtp || verifyingOtp}>
                      {resendingOtp ? "Resending OTP..." : "Resend OTP"}
                    </Button>
                  </div>
                </motion.form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterForm;