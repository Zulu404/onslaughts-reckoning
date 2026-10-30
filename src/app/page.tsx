import Image from "next/image";
import EmberField from "@/components/EmberField";
import DiscordButton from "@/components/DiscordButton";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 py-14">
      <EmberField sourceSelector="#guild-logo" />

      <h1 className="sr-only">
        Onslaught&apos;s Reckoning — EU Horde PvP guild for WoW Forever
      </h1>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <div
            aria-hidden
            className="logo-halo pointer-events-none absolute -inset-[10%]"
          />
          <Image
            id="guild-logo"
            src="/logo.jpg"
            alt="Onslaught's Reckoning"
            width={1253}
            height={1254}
            priority
            className="relative w-[min(80vmin,560px)] select-none"
            style={{ mixBlendMode: "screen" }}
          />
          <Image
            aria-hidden
            alt=""
            src="/logo.jpg"
            width={1253}
            height={1254}
            className="logo-fire pointer-events-none absolute inset-0 h-full w-full select-none"
          />
        </div>

        <div className="-mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-stone-400 sm:-mt-6 sm:gap-4 sm:text-xs">
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

        <p className="font-display mt-5 text-center text-sm uppercase tracking-[0.3em] text-amber-200/90 sm:text-base">
          Now Recruiting
        </p>

        <div className="mt-10">
          <DiscordButton />
        </div>
      </div>

      <svg aria-hidden focusable="false" className="absolute h-0 w-0">
        <defs>
          <filter
            id="fire-anim"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            {/* Red weighted against green and blue: neutral greys cancel to
                black, so only the saturated flames survive. */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1.4 -0.7 -0.7 0 0
                      0.49 -0.245 -0.245 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="flames"
            />
            {/* High x / low y frequency stretches the noise vertically into
                flame-shaped tongues rather than round blobs. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.012"
              numOctaves={2}
              seed={11}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.035 0.012; 0.045 0.016; 0.030 0.010; 0.035 0.012"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="flames"
              in2="noise"
              scale={14}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Same idea at button scale. No colour matrix: the aura behind
              the button is already pure flame colour, so there is nothing
              to isolate. Softened first so the warped rim reads as flame
              rather than a torn edge. */}
          <filter
            id="fire-btn"
            x="-30%"
            y="-60%"
            width="160%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.1" result="soft" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.09 0.035"
              numOctaves={2}
              seed={5}
              result="btnNoise"
            >
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.09 0.035; 0.115 0.045; 0.075 0.028; 0.09 0.035"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="soft"
              in2="btnNoise"
              scale={8}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </main>
  );
}
