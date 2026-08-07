"use client";

import { useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type SuggestionType = "Destination" | "2 Day Loop" | "4 Day Loop" | "Other";

export default function SuggestionSheet() {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [entryType, setEntryType] = useState<SuggestionType>("Destination");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      ),
    [],
  );

  const resetForm = () => {
    setContact("");
    setEntryType("Destination");
    setDescription("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contact.trim() || !description.trim()) {
      setStatus("error");
      setMessage("Please add both contact details and a description.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const { error } = await supabase.from("suggestions").insert({
      email_or_phone: contact.trim(),
      entry_type: entryType,
      description: description.trim(),
    });

    if (error) {
      setStatus("error");
      setMessage(error.message || "Unable to save suggestion right now.");
      return;
    }

    resetForm();
    setStatus("success");
    setMessage("Thanks! Your suggestion has been saved.");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStatus("idle");
          setMessage("");
        }}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
      >
        Suggest an idea
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3">
          <div className="w-full max-w-2xl rounded-t-[28px] bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Suggestions
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  Share a route idea
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Email or phone</span>
                <input
                  type="text"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="name@example.com or +91..."
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Type of entry</span>
                <select
                  value={entryType}
                  onChange={(event) =>
                    setEntryType(event.target.value as SuggestionType)
                  }
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Destination</option>
                  <option>2 Day Loop</option>
                  <option>4 Day Loop</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Description</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Share the destination, loop, or anything else you'd like to suggest."
                  rows={5}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {message ? (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    status === "error"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? "Saving..." : "Save suggestion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
