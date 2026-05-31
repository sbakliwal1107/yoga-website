"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // Demo behaviour: pretend to send, then succeed.
    // Replace this with a real API call (e.g. Formspree, Resend, or your own
    // Next.js API route) when you're ready.
    await new Promise((res) => setTimeout(res, 900));
    setStatus("success");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-serif text-3xl mb-2">Send us a note</h2>

      <div>
        <label className="block text-sm mb-2 text-muted" htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-xl border border-sand bg-background focus:outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-muted" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-xl border border-sand bg-background focus:outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-muted" htmlFor="interest">
          What are you interested in?
        </label>
        <select
          id="interest"
          name="interest"
          className="w-full px-4 py-3 rounded-xl border border-sand bg-background focus:outline-none focus:border-sage"
        >
          <option>Trying a class</option>
          <option>Private sessions</option>
          <option>Workshops</option>
          <option>Corporate yoga</option>
          <option>Just saying hi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-2 text-muted" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-xl border border-sand bg-background focus:outline-none focus:border-sage resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {status === "success" && (
        <p className="text-sage-dark text-sm pt-2">
          Thank you — we received your message and will reply soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-terracotta text-sm pt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
