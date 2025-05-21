"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <div className="space-y-8 text-zinc-400">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Chimly's services, you agree to be bound by
              these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              2. User Responsibilities
            </h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your data complies with our policies</li>
              <li>Using our services in accordance with applicable laws</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              3. Service Description
            </h2>
            <p>
              Chimly provides AI-powered task management and productivity tools.
              We reserve the right to modify, suspend, or discontinue any part
              of our services at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              4. Intellectual Property
            </h2>
            <p>
              All content, features, and functionality of our services are owned
              by Chimly and are protected by international copyright, trademark,
              and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              5. Limitation of Liability
            </h2>
            <p>
              Chimly shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use or
              inability to use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or through our
              services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">7. Contact Us</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@chimly.ai"
                className="text-emerald-400 hover:text-emerald-300"
              >
                legal@chimly.ai
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
