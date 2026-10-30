import Image from "next/image";
import EmberField from "@/components/EmberField";
import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 py-14">
      <EmberField />

      <h1 className="sr-only">
        Onslaught&apos;s Reckoning — EU Horde PvP guild for WoW Forever
      </h1>

      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/logo.jpg"
          alt="Onslaught's Reckoning"
          width={1253}
          height={1254}
          priority
          className="w-[min(80vmin,560px)] select-none"
          style={{ mixBlendMode: "screen" }}
        />

        <p className="font-display -mt-4 text-center text-base uppercase tracking-[0.22em] text-amber-200/85 sm:-mt-6 sm:text-xl">
          We raid. We conquer. We endure.
        </p>

        <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-stone-400 sm:gap-4 sm:text-xs">
          <span>Horde</span>
          <span aria-hidden className="text-orange-700/70">
            &bull;
          </span>
          <span>PvP Ruleset</span>
          <span aria-hidden className="text-orange-700/70">
            &bull;
          </span>
          <span>EU</span>
        </div>

        <p className="mt-4 text-center text-[11px] tracking-[0.12em] text-amber-200/70 sm:text-xs">
          Recruiting for launch &mdash; everyone starts at level 1
        </p>

        <div className="mt-10">
          <DiscordButton />
        </div>
      </div>
    </main>
  );
}
