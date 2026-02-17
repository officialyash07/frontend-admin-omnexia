import { createPortal } from "react-dom";

export default function Modal({ title, children, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
        // Ensure flex layout works for centering
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Overlay click to close */}
      <div
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white text-gray-900 w-full"
        style={{
          background: "#ffffff",
          padding: "30px",
          maxWidth: "500px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          zIndex: 10000,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h3>
          {/* No close button in top right to match reference strictly, 
              but keeping onClose prop for overlay/Cancel button */}
        </div>

        <div
          className="overflow-y-auto custom-scrollbar"
          style={{ paddingRight: "4px" }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
