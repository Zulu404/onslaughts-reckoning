"use client";

import { useActionState, useState } from "react";
import { CLASSES, PROFESSIONS } from "@/lib/wow";
import { addCharacter, type FormState } from "./actions";

const MAX_PROFESSIONS = 2;
const initialState: FormState = {};

export default function CharacterForm({ isFirst }: { isFirst: boolean }) {
  const [state, action, pending] = useActionState(addCharacter, initialState);

  // Remounting after a successful save clears both the uncontrolled inputs and
  // the local selections, without an effect that resets state on render.
  return (
    <Fields
      key={state.savedAt ?? 0}
      action={action}
      pending={pending}
      error={state.error}
      isFirst={isFirst}
    />
  );
}

function Fields({
  action,
  pending,
  error,
  isFirst,
}: {
  action: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  isFirst: boolean;
}) {
  const [wowClass, setWowClass] = useState("");
  const [role, setRole] = useState("");
  const [professions, setProfessions] = useState<string[]>([]);

  // Roles come from the class, so a Mage is never offered Tank.
  const roles = CLASSES.find((c) => c.name === wowClass)?.roles ?? [];

  function toggleProfession(name: string) {
    setProfessions((current) =>
      current.includes(name)
        ? current.filter((p) => p !== name)
        : current.length < MAX_PROFESSIONS
          ? [...current, name]
          : current,
    );
  }

  return (
    <form action={action} className="panel p-5">
      <h2 className="font-display mb-4 text-sm uppercase tracking-[0.2em] text-amber-200/90">
        {isFirst ? "Register your main" : "Add another character"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Character name
          </label>
          <input
            id="name"
            name="name"
            className="field"
            required
            minLength={2}
            maxLength={24}
            autoComplete="off"
            placeholder="Wolfstride"
          />
        </div>

        <div>
          <label className="label" htmlFor="surname">
            Surname <span className="normal-case opacity-60">(optional)</span>
          </label>
          <input
            id="surname"
            name="surname"
            className="field"
            maxLength={24}
            autoComplete="off"
            placeholder="Spinebreaker"
          />
        </div>

        <div>
          <label className="label" htmlFor="class">
            Class
          </label>
          <select
            id="class"
            name="class"
            className="field"
            required
            value={wowClass}
            onChange={(e) => {
              setWowClass(e.target.value);
              setRole("");
            }}
          >
            <option value="">Choose a class…</option>
            {CLASSES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="field"
            required
            disabled={!wowClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">
              {wowClass ? "Choose a role…" : "Pick a class first"}
            </option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="label">
          Professions{" "}
          <span className="normal-case opacity-60">
            (up to {MAX_PROFESSIONS}, optional)
          </span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROFESSIONS.map((p) => {
            const checked = professions.includes(p);
            const atLimit = !checked && professions.length >= MAX_PROFESSIONS;
            return (
              <label
                key={p}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  checked
                    ? "border-orange-600 bg-orange-600/20 text-amber-100"
                    : atLimit
                      ? "border-stone-800 text-stone-600"
                      : "border-stone-700 text-stone-300 hover:border-orange-700/70"
                }`}
              >
                <input
                  type="checkbox"
                  name="professions"
                  value={p}
                  checked={checked}
                  disabled={atLimit}
                  onChange={() => toggleProfession(p)}
                  className="sr-only"
                />
                {p}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-stone-300">
        <input
          type="checkbox"
          name="planned"
          className="mt-0.5 accent-orange-600"
        />
        <span>
          I haven&apos;t rolled this character yet — it&apos;s planned for
          launch.
        </span>
      </label>

      {error && (
        <p
          aria-live="polite"
          className="mt-4 rounded border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-ember mt-5" disabled={pending}>
        {pending ? "Saving…" : isFirst ? "Register character" : "Add character"}
      </button>
    </form>
  );
}
