import Link from "next/link";

export default function CategoryLabel({ children }) {
  const colorKey = {
    "Web Development": "black",
    JavaScript: "yellow",
    CSS: "blue",
    Python: "green",
    PHP: "purple",
    Ruby: "red",
  };

  return (
    <div
      className={`px-2 py-1 bg-${colorKey[children]}-600 text-gray-300 font-bold rounded`}
    >
      {children}
    </div>
  );
}
