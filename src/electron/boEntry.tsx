import { generateBackOfficeURL } from "@ct/common";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);
const BoApp = () => {
  useEffect(() => {
    if (generateBackOfficeURL) {
      window.location.replace(generateBackOfficeURL());
    }
  }, []);

  return <div />;
};

root.render(<BoApp />);
