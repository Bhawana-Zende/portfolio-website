"use client";

import { useState } from "react";

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
    <div className="grid gap-[clamp(3rem,6vw,5rem)] md:grid-cols-2">
      <div>
        <p
          className="u-lede m-0 max-w-[26rem]"
          style={{ color: "var(--ink-muted)" }}
        >
          The lights are going down. Thank you for walking through.
        </p>

        <ul className="m-0 mt-10 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
          {[
            ["Email", "mailto:hello@bhawanazende.com"],
            ["LinkedIn", "#"],
            ["Medium", "#"],
            ["GitHub", "#"],
          ].map(([label, href]) => (
            <li key={label} className="m-0">
              <a className="u-label" style={{ color: "var(--accent)" }} href={href}>
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
        <label className="u-micro block" htmlFor="guestbook-email" style={{ color: "var(--ink-faint)" }}>
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
            borderBottom: "1px solid var(--hairline)",
            color: "var(--ink)",
            fontSize: "var(--text-body)",
          }}
        />
        <button
          type="submit"
          className="u-label mt-6 px-5 py-3"
          style={{ color: "var(--ink-muted)", border: "1px solid var(--hairline)" }}
        >
          Sign the guestbook
        </button>

        <p
          className="u-micro m-0 mt-5"
          style={{ color: "var(--ink-faint)" }}
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
