import Image from "next/image";
import FireCanvas from "@/components/FireCanvas";
import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center gap-8 overflow-hidden px-6">
      <FireCanvas />

      <div
        className="relative z-10"
        style={{
          filter:
            "drop-shadow(0 0 40px rgba(220,60,0,0.7)) drop-shadow(0 0 80px rgba(180,30,0,0.4))",
        }}
      >
        <Image
          src="/guild-logo.jpg"
          alt="Onslaught's Reckoning"
          width={480}
          height={480}
          priority
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] object-contain select-none"
        />
      </div>

      <DiscordButton />
    </div>
  );
}
