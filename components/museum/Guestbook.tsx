"use client";

import { useState } from "react";
import { backdrop } from "@/content/backdrop";

/**
 * The way out. The newsletter goes through one adapter so a provider can
 * be swapped without touching this component — for now it's a stub that
 * says plainly that nothing was sent.
 */
async function subscribe(email: string): Promise<"stub"> {
  // Replace with the provider call. Keep the signature.
  void email;
  return "stub";
}

export function Guestbook() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");

  return (
    <div className="grid gap-[var(--spacing-60)] md:grid-cols-2">
      <div>
        <p
          className="t-heading-lg max-w-[18ch]"
        >
          The lights are going down. Thank you for walking through.
        </p>

        <p className="t-micro mt-[var(--spacing-40)]" style={{ color: "var(--room-muted)" }}>
          Backdrop: {backdrop.credit.artist}, <i>{backdrop.credit.title}</i> ·{" "}
          {backdrop.credit.source} · {backdrop.credit.licence}
        </p>

        <ul className="m-0 mt-10 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
          {[
            ["Email", "mailto:hello@bhawanazende.com"],
            ["LinkedIn", "#"],
            ["Medium", "#"],
            ["GitHub", "#"],
          ].map(([label, href]) => (
            <li key={label} className="m-0">
              <a className="c-link t-label" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await subscribe(email);
          setState("done");
        }}
      >
        <label className="t-micro block" htmlFor="guestbook-email" style={{ color: "var(--room-muted)" }}>
          Leave your address
        </label>
        <input
          id="guestbook-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-4 w-full bg-transparent py-3 outline-none"
          style={{
            borderBottom: "1px solid var(--room-rule)",
            color: "var(--room-fg)",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          className="c-pill mt-[24px]"
        >
          Sign the guestbook
        </button>

        <p
          className="t-micro mt-[20px]"
          style={{ color: "var(--room-muted)" }}
          role="status"
        >
          {state === "done"
            ? "Nothing was sent — the newsletter isn't connected yet."
            : "No provider is connected yet."}
        </p>
      </form>
    </div>
  );
}
