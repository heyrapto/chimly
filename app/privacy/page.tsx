"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/assets/logo.png"
            alt="Chimly"
            width={120}
            height={120}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-zinc-400">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us when you create
              an account, use our services, or communicate with us. This may
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Task and project data</li>
              <li>Usage information and preferences</li>
              <li>Communication records</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              How We Use Data
            </h2>
            <p>
              We use the collected information to provide, maintain, and improve
              our services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personalizing your experience</li>
              <li>Processing your requests and transactions</li>
              <li>Sending you technical notices and updates</li>
              <li>Responding to your comments and questions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              Internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal
              information. You can also opt out of marketing communications at
              any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:privacy@chimly.ai"
                className="text-emerald-400 hover:text-emerald-300"
              >
                privacy@chimly.ai
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
