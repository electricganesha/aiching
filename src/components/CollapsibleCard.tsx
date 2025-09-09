import { BORDER_COLOR } from "../pages/Home";

interface CollapsibleCardProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export const CollapsibleCard = ({
  children,
  ...props
}: CollapsibleCardProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        margin: 24,
        borderRadius: 8,
        border: `1px solid ${BORDER_COLOR}`,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      {...props}
    >
      {children}
    </div>
  );
};
