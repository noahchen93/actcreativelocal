import { useEffect, useState } from "react";

const slides = [
  {
    src: "/case-studies/images/big-big-world.webp",
    alt: "A BIG BIG WORLD light show installation at Sentosa, Singapore",
    label: "A BIG BIG WORLD · Sentosa",
  },
  {
    src: "/case-studies/images/wings-of-art.webp",
    alt: "Wings of Art Barbie charity art exhibition runway, Singapore",
    label: "Wings of Art · Barbie Runway",
  },
  {
    src: "/case-studies/images/pacman-friends.webp",
    alt: "PACMAN and Friends human game public activation at Sentosa",
    label: "PACMAN & Friends · Sentosa",
  },
];

const INTERVAL_MS = 5000;
const FADE_MS = 900;

const ABSOLUTE_FILL = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
};

export function HeroSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        overflow: "hidden",
        borderRadius: "1rem",
        background: "#0a0a0a",
        border: "1px solid rgba(204,255,0,0.18)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
      }}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading="eager"
          decoding="async"
          style={{
            ...ABSOLUTE_FILL,
            objectFit: "cover",
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}

      {/* gradient at bottom for label legibility */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "55%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* label */}
      <div
        style={{
          position: "absolute",
          left: "1.25rem",
          right: "5rem",
          bottom: "1rem",
          color: "white",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            color: "#CCFF00",
            fontSize: "0.6875rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "0.25rem",
          }}
        >
          Selected work
        </p>
        <p style={{ color: "white", fontSize: "0.875rem", fontWeight: 500 }}>
          {slides[idx].label}
        </p>
      </div>

      {/* dots */}
      <div
        style={{
          position: "absolute",
          right: "1rem",
          bottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show slide ${i + 1}`}
            style={{
              width: i === idx ? "20px" : "6px",
              height: "6px",
              borderRadius: "9999px",
              background: i === idx ? "#CCFF00" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
