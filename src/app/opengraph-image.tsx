import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Golden Grace - Premium Fine Jewellery";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(183, 110, 121, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(88, 114, 132, 0.15)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: 8,
            textAlign: "center",
            zIndex: 1,
          }}
        >
          GOLDEN GRACE
        </div>

        {/* Divider line */}
        <div
          style={{
            width: 200,
            height: 2,
            background: "linear-gradient(90deg, transparent, #B76E79, transparent)",
            margin: "24px 0",
            zIndex: 1,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 4,
            textAlign: "center",
            zIndex: 1,
          }}
        >
          PREMIUM FINE JEWELLERY
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
            zIndex: 1,
          }}
        >
          {["BIS Hallmarked", "Diamonds & Gold", "Free Shipping"].map((feature) => (
            <div
              key={feature}
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2,
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
