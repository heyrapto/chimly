"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Clock } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const form = formRef.current;
      if (!form) return;

      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form,
        "YOUR_PUBLIC_KEY"
      );

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Left Column - Contact Form */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-zinc-400 mb-8">
              Have a question or feedback? We'd love to hear from you. Fill out
              the form below and we'll get back to you as soon as possible.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm text-zinc-400">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="block text-sm text-zinc-400"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="What's this about?"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm text-zinc-400"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {/* Success Message */}
              {isSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg">
                  Thanks for reaching out! We'll get back to you soon.
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-12">
            {/* Company Logo */}
            <div>
              <Image
                src="/assets/logo.png"
                alt="Chimly"
                width={140}
                height={140}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Email Us
                  </h3>
                  <p className="text-zinc-400">
                    For general inquiries:{" "}
                    <a
                      href="mailto:hello@chimly.ai"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      hello@chimly.ai
                    </a>
                  </p>
                  <p className="text-zinc-400">
                    For support:{" "}
                    <a
                      href="mailto:support@chimly.ai"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      support@chimly.ai
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Live Chat
                  </h3>
                  <p className="text-zinc-400">
                    Our live chat support is available directly within the
                    Chimly app for faster responses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Response Time
                  </h3>
                  <p className="text-zinc-400">
                    We typically respond within 24 hours during business days.
                    Premium support users receive priority responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
