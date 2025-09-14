export const Spinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid var(--highlight)",
          borderTop: "4px solid var(--box-shadow)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
