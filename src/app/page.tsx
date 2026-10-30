import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center" style={{ marginBottom: "-8vmin" }}>
        <video
          src="/logo-animated.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-[90vmin] h-[90vmin] max-w-[700px] max-h-[700px] object-contain select-none"
          style={{ mixBlendMode: "screen" }}
        />
      </div>

      <DiscordButton />
    </div>
  );
}
