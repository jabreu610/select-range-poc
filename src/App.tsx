import { useEffect, useRef, useState, forwardRef } from "react";
import "./App.css";

type FloatingMenuProps = {
  x: number;
  y: number;
  show: boolean;
  message: string;
};

const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  ({ x, y, show, message }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: show ? "block" : "none",
          position: "absolute",
          top: y,
          left: x,
          backgroundColor: "rgba(245, 245, 245, 0.6)",
          backdropFilter: "blur(5px)", 
          border: "1px solid rgba(0, 0, 0, 1)", 
          padding: "10px",
          color: "rgba(0, 0, 0, 1)", 
          zIndex: 1000,
        }}
      >
        <pre style={{ textAlign: "left", margin: 0, fontWeight: 'bold' }}>{message}</pre>
      </div>
    );
  }
);

function App() {
  const [value, setValue] = useState("This is a test value");
  const [showMenu, setShowMenu] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const selectedText = target.value.substring(start, end);
    setMessage(`Selected text: ${selectedText}
Start: ${start}
End: ${end}`);
    setShowMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (
          !event.target.closest("textarea") &&
          !menuRef.current?.contains(event.target)
        ) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <textarea
        onSelect={handleSelect}
        onMouseUp={(e) =>
          (mousePosRef.current = { x: e.clientX, y: e.clientY })
        }
        style={{ fontSize: "16px" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        cols={80}
      />
      <FloatingMenu
        show={showMenu}
        ref={menuRef}
        message={message}
        x={mousePosRef.current.x}
        y={mousePosRef.current.y}
      />
    </>
  );
}

export default App;
