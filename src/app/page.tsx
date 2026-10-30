import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-4">
      <div
        className="relative"
        style={{
          filter: "drop-shadow(0 0 60px rgba(200,50,0,0.6)) drop-shadow(0 0 120px rgba(150,20,0,0.3))",
        }}
      >
        <video
          src="/logo-animated.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-72 h-72 sm:w-96 sm:h-96 md:w-[520px] md:h-[520px] object-contain select-none"
        />
      </div>

      <DiscordButton />
    </div>
  );
}
