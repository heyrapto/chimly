"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Twitter, ArrowLeft } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactConfetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// List of allowed email domains
const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
];

// Add this near the top with other constants
const PLAN_OPTIONS = [
  { value: "Individual", label: "Individual Plan" },
  { value: "Team", label: "Team Plan" },
  { value: "Enterprise", label: "Enterprise Plan" },
] as const;

export default function WaitlistPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // Initialize EmailJS
  useEffect(() => {
    try {
      emailjs.init("IM1qBRmOP9zZWizWv");
    } catch (error) {
      console.error("EmailJS initialization error:", error);
    }
  }, []);

  // Add window size effect
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateEmail = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      toast.error("Please use a personal email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = formRef.current;
      if (!form) return;

      const email = form.user_email.value;
      if (!validateEmail(email)) {
        setIsSubmitting(false);
        return;
      }

      const templateParams = {
        from_name: form.user_name.value, // Make sure these match your EmailJS template variables
        to_name: "Admin",
        user_name: form.user_name.value,
        user_email: email,
        selected_plan: selectedPlan,
        consent: form.consent.checked ? "Yes" : "No",
        signup_time: new Date().toLocaleString(),
      };

      const response = await emailjs.send(
        "service_fpeyuli",
        "template_21p6fmi",
        templateParams,
        "IM1qBRmOP9zZWizWv"
      );

      if (response.status === 200) {
        toast.success("Thanks for joining! We'll be in touch soon.");
        form.reset();
        setSelectedPlan("");
        // Show success modal and confetti
        setShowSuccessModal(true);
        setShowConfetti(true);
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again later.");
      console.error("EmailJS Error:", error?.text || error?.message || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this before the return statement
  useEffect(() => {
    if (showSuccessModal) {
      // Hide modal after 6 seconds
      const timer = setTimeout(() => setShowSuccessModal(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Background Avatars */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-4 sm:top-14 sm:left-10 animate-float-slow">
          <Image
            src="/assets/sarah.svg"
            alt=""
            width={40}
            height={40}
            className="rounded-full sm:w-[60px] sm:h-[60px]"
          />
        </div>
        <div className="absolute bottom-20 right-4 sm:bottom-20 sm:right-20 animate-float">
          <Image
            src="/assets/henry.svg"
            alt=""
            width={40}
            height={40}
            className="rounded-full sm:w-[60px] sm:h-[60px]"
          />
        </div>
        <div className="absolute top-1/2 right-4 sm:top-1/3 sm:right-1/4 animate-float-delayed">
          <Image
            src="/assets/muniz.svg"
            alt=""
            width={40}
            height={40}
            className="rounded-full sm:w-[60px] sm:h-[60px]"
          />
        </div>
        <div className="absolute bottom-1/3 left-4 sm:bottom-1/3 sm:left-1/4 animate-float-slow">
          <Image
            src="/assets/ruth.svg"
            alt=""
            width={40}
            height={40}
            className="rounded-full sm:w-[60px] sm:h-[60px]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-2xl mx-auto text-center px-4">
        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <Image
            src="/assets/logo.png"
            alt="Chimly"
            width={100}
            height={30}
            className="mx-auto sm:w-[140px] sm:h-[40px]"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tighter text-white mb-4 sm:mb-6">
          Join us now as we <br />
          <span className="bg-gradient-to-r tracking-tighter leading-tight from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
            Simplify the way you work
          </span>{" "}
          <br />
          <span className="bg-gradient-to-r tracking-tighter leading-tight font-fancy from-emerald-400 via-emerald-500 to-emerald-600 text-transparent bg-clip-text">
            With Chimly
          </span>
        </h1>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 mt-8 sm:mt-12 max-w-md mx-auto"
        >
          <input
            type="text"
            name="user_name"
            placeholder="Enter your name"
            required
            className="w-full px-4 py-2 sm:py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm sm:text-base"
          />
          <input
            type="email"
            name="user_email"
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 sm:py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm sm:text-base"
          />

          {/* Plan Selection using Shadcn Select */}
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger className="w-full px-4 py-2 sm:py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm sm:text-base">
              <SelectValue placeholder="Select your plan" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border border-zinc-800 text-white">
              {PLAN_OPTIONS.map((plan) => (
                <SelectItem
                  key={plan.value}
                  value={plan.value}
                  className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white"
                >
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-400">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              className="rounded border-zinc-700 mt-1"
            />
            <label htmlFor="consent">
              I agree to receive updates, newsletters, and promotional messages
              from Chimly
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </button>
        </form>

        {/* Social Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-zinc-400 mb-2 text-xs sm:text-sm">
            Follow us for updates
          </p>
          <Link
            href="https://twitter.com/chimly"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm sm:text-base"
          >
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>@chimly</span>
          </Link>
        </div>
      </div>

      {/* Add Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white p-6 sm:p-8 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Registration Success</DialogTitle>
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">❤️</div>
              <h2 className="text-2xl font-bold">Thank You for Joining!</h2>
              <p className="text-zinc-400">
                Get ready! We're preparing something amazing and you'll be among
                the first to know when we launch.
              </p>
              <p className="text-emerald-500 font-medium">
                Stay tuned for updates! 🚀
              </p>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Add Confetti */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          colors={["#059669", "#34d399", "#6ee7b7", "#ffffff"]}
        />
      )}
    </div>
  );
}
