import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <video
        src="/logo-animated.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 flex min-h-screen items-end justify-center pb-16">
        <DiscordButton />
      </div>
    </div>
  );
}
