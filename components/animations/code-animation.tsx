import { useEffect, useRef, useState } from "react";

export function CodeAnimation() {
  const [text, setText] = useState("");
  const fullText = `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`;

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setText(""), 2000); // Clear text after 2 seconds
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg p-4 overflow-hidden">
      <pre className="text-green-400 font-mono text-sm md:text-base whitespace-pre-wrap">
        <code>{text}</code>
      </pre>
    </div>
  );
}
