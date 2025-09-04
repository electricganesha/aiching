import { WilhelmHexagram } from "../types/wilhelm";

// Function to render the hexagram using SVG
const renderHexagram = (hexagram: string, step: number) => {
  const lineHeight = 10;
  const lineWidth = 100;
  const gap = 5;
  const strokeWidth = 5;

  return (
    <svg width={lineWidth} height={lineHeight * 6 + gap * 5}>
      {hexagram
        .split("")
        .reverse() // Reverse to draw bottom line first
        .map((line, index) => (
          <line
            key={index}
            x1={0}
            y1={index * (lineHeight + gap)}
            x2={lineWidth}
            y2={index * (lineHeight + gap)}
            stroke={line === "1" ? "#7d4a5b" : "transparent"}
            strokeWidth={strokeWidth}
            style={{ opacity: step > index ? 1 : 0 }}
          />
        ))}
      {hexagram
        .split("")
        .reverse() // Reverse to draw bottom line first
        .map((line, index) =>
          line === "0" ? (
            <line
              key={index}
              x1={0}
              y1={index * (lineHeight + gap)}
              x2={lineWidth / 2 - 5}
              y2={index * (lineHeight + gap)}
              stroke="#7d4a5b"
              strokeWidth={strokeWidth}
              style={{ opacity: step > index ? 1 : 0 }}
            />
          ) : null
        )}
      {hexagram
        .split("")
        .reverse() // Reverse to draw bottom line first
        .map((line, index) =>
          line === "0" ? (
            <line
              key={index}
              x1={lineWidth / 2 + 5}
              y1={index * (lineHeight + gap)}
              x2={lineWidth}
              y2={index * (lineHeight + gap)}
              stroke="#7d4a5b"
              strokeWidth={strokeWidth}
              style={{ opacity: step > index ? 1 : 0 }}
            />
          ) : null
        )}
    </svg>
  );
};

interface HexagramTextProps {
  hexagram: string;
  trigrams: { lower: { name: string }; upper: { name: string } } | null;
  hexagramData: { name: string; number: number } | null;
  hexagramText: WilhelmHexagram | null;
}

export const HexagramText: React.FC<HexagramTextProps> = ({
  hexagram,
  trigrams,
  hexagramData,
  hexagramText,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
        }}
      >
        <h2>Hexagram: {hexagram}</h2>
        {renderHexagram(hexagram, 6)}
      </div>
      <hr style={{ border: "1px solid #a79e91", margin: "20px 0" }}></hr>
      {hexagramText && (
        <>
          <p>
            <b>Lower Trigram:</b> {trigrams?.lower?.name}
          </p>
          <p>
            <b>Upper Trigram:</b> {trigrams?.upper?.name}
          </p>
          <p>
            <b> Name:</b> {hexagramData?.name}
          </p>
          <hr style={{ border: "1px solid #a79e91", margin: "20px 0" }}></hr>
          <u>
            <h3> Symbolism</h3>
          </u>
          <p>
            <b>Hexagram Number:</b> {hexagramData?.number}
          </p>
          <p>{hexagramText?.wilhelm_symbolic}</p>
          <hr style={{ border: "1px solid #a79e91", margin: "20px 0" }}></hr>
          <u>
            <h3>Judgment</h3>
          </u>
          <p>
            <b>Original Text:</b> {hexagramText?.wilhelm_judgment.text}
          </p>
          <p>
            <b>Comments:</b> {hexagramText?.wilhelm_judgment.comments}
          </p>
          <hr style={{ border: "1px solid #a79e91", margin: "20px 0" }}></hr>
          <u>
            <h3>Image</h3>
          </u>
          <p>
            <b>Original Text:</b> {hexagramText?.wilhelm_image.text}
          </p>
          <p>
            <b>Comments:</b> {hexagramText?.wilhelm_image.comments}
          </p>
          <hr style={{ border: "1px solid #a79e91", margin: "20px 0" }}></hr>
          <u>
            <h3>Lines</h3>
          </u>
          {hexagramText &&
            Object.entries(hexagramText.wilhelm_lines).map(([_index, line]) => (
              <div
                key={_index}
                style={{ borderBottom: "1px solid #a79e91", marginBottom: 10 }}
              >
                <h4>Line {_index}</h4>
                <p>
                  <b>Original Text:</b> {line.text}
                </p>
                <p>
                  <b>Comments:</b> {line.comments}
                </p>
              </div>
            ))}
        </>
      )}
    </div>
  );
};
