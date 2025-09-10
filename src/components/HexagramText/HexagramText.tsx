import { WilhelmHexagram } from "@/types/wilhelm";
import { Card } from "../Card/Card";

import "./HexagramText.css";

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
            key={line}
            x1={0}
            y1={index * (lineHeight + gap)}
            x2={lineWidth}
            y2={index * (lineHeight + gap)}
            stroke={line === "1" ? "var(--highlight)" : "transparent"}
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
              key={line}
              x1={0}
              y1={index * (lineHeight + gap)}
              x2={lineWidth / 2 - 5}
              y2={index * (lineHeight + gap)}
              stroke="var(--highlight)"
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
              key={line}
              x1={lineWidth / 2 + 5}
              y1={index * (lineHeight + gap)}
              x2={lineWidth}
              y2={index * (lineHeight + gap)}
              stroke="var(--highlight)"
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
      <Card>
        <div className="hexagramText">
          {renderHexagram(hexagram, 6)}
          <h3>{hexagramData?.name}</h3>
        </div>
      </Card>
      <hr className="divider"></hr>
      {hexagramText && (
        <>
          <Card>
            <p>
              <b>Lower Trigram:</b> {trigrams?.lower?.name}
            </p>
            <p>
              <b>Upper Trigram:</b> {trigrams?.upper?.name}
            </p>
          </Card>
          <hr className="divider"></hr>
          <Card>
            <u>
              <h3> Symbolism</h3>
            </u>
            <p>
              <b>Hexagram Number:</b> {hexagramData?.number}
            </p>
            <p>{hexagramText?.wilhelm_symbolic}</p>
          </Card>
          <hr className="divider"></hr>
          <Card>
            <u>
              <h3>Judgment</h3>
            </u>
            <p>
              <b>Original Text:</b> {hexagramText?.wilhelm_judgment.text}
            </p>
            <p>
              <b>Comments:</b> {hexagramText?.wilhelm_judgment.comments}
            </p>
          </Card>
          <hr className="divider"></hr>
          <Card>
            <u>
              <h3>Image</h3>
            </u>
            <p>
              <b>Original Text:</b> {hexagramText?.wilhelm_image.text}
            </p>
            <p>
              <b>Comments:</b> {hexagramText?.wilhelm_image.comments}
            </p>
          </Card>
          <hr className="divider"></hr>
          <Card>
            <u>
              <h3>Lines</h3>
            </u>
            {hexagramText &&
              Object.entries(hexagramText.wilhelm_lines).map(
                ([_index, line]) => (
                  <div
                    key={_index}
                    style={{
                      borderBottom:
                        Number(_index) !==
                        Object.entries(hexagramText.wilhelm_lines).length
                          ? `1px solid var(--shadow)`
                          : "none",
                      marginBottom: 10,
                    }}
                  >
                    <h4>Line {_index}</h4>
                    <p>
                      <b>Original Text:</b> {line.text}
                    </p>
                    <p>
                      <b>Comments:</b> {line.comments}
                    </p>
                  </div>
                )
              )}
          </Card>
        </>
      )}
    </div>
  );
};
