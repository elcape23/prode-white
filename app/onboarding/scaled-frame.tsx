"use client";

import { useEffect, useState } from "react";

const DESIGN_WIDTH = 440;
const DESIGN_HEIGHT = 852;

/**
 * Renderiza el contenido en un lienzo fijo de 393×852 (el canvas de Figma) y lo
 * escala proporcionalmente para que entre en cualquier viewport, sin scroll y
 * conservando exactamente las proporciones del diseño.
 */
export function ScaledFrame({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      setScale(
        Math.min(
          window.innerWidth / DESIGN_WIDTH,
          window.innerHeight / DESIGN_HEIGHT,
        ),
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
        transformOrigin: "center",
        opacity: scale === null ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
}
