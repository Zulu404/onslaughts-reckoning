import Image from "next/image";
import EmberField from "@/components/EmberField";
import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 py-14">
      <EmberField />

      <h1 className="sr-only">
        Onslaught&apos;s Reckoning — EU PvP World of Warcraft Guild
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
          <span>EU</span>
          <span aria-hidden className="text-orange-700/70">
            &bull;
          </span>
          <span>PvP Realm</span>
          <span aria-hidden className="text-orange-700/70">
            &bull;
          </span>
          <span className="text-amber-300/90">Now Recruiting</span>
        </div>

        <div className="mt-11">
          <DiscordButton />
        </div>
      </div>
    </main>
  );
}
