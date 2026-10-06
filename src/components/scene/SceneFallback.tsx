import { layers, ringRadius } from "./layers";

// Versão estática da cena, usada enquanto o 3D carrega e em navegadores sem WebGL.
const scale = 64;
const center = { x: 220, y: 230 };

const points = layers.map((layer) => ({
  ...layer,
  x: center.x + Math.sin(layer.angle) * ringRadius * scale,
  y: center.y - layer.y * scale,
}));

const path = points
  .map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const midY = (previous.y + point.y) / 2;
    return `C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
  })
  .join(" ");

export function SceneFallback() {
  return (
    <svg viewBox="0 0 440 460" className="size-full" aria-hidden="true">
      <defs>
        <radialGradient id="fallback-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={center.x} cy={center.y} r="200" fill="url(#fallback-glow)" />
      <line x1={center.x} x2={center.x} y1="30" y2="430" stroke="#38bdf8" strokeOpacity="0.25" />
      {points.map((point) => (
        <ellipse
          key={`ring-${point.id}`}
          cx={center.x}
          cy={point.y}
          rx={ringRadius * scale}
          ry={ringRadius * scale * 0.2}
          fill="none"
          stroke="#94a3b8"
          strokeOpacity="0.1"
        />
      ))}
      <path d={path} fill="none" stroke="#38bdf8" strokeOpacity="0.55" strokeDasharray="4 6" />
      {points.map((point) => (
        <g key={point.id}>
          <line x1={center.x} y1={point.y} x2={point.x} y2={point.y} stroke="#38bdf8" strokeOpacity="0.2" />
          <rect
            x={point.x - 16}
            y={point.y - 16}
            width="32"
            height="32"
            rx="7"
            fill="#0e141c"
            stroke="#38bdf8"
            strokeOpacity="0.7"
          />
          <circle cx={point.x} cy={point.y} r="4" fill="#7dd3fc" />
          <text
            x={point.x + (point.x < center.x - 4 ? -26 : 26)}
            y={point.y + 4}
            textAnchor={point.x < center.x - 4 ? "end" : "start"}
            fill="#94a0b2"
            fontSize="11"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1.5"
          >
            {point.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
