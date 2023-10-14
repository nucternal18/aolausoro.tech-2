import Link from "next/link";

export default function CategoryLabel({ variant }: { variant: string }) {
  const colorKey: { [key: string]: string } = {
    "Web Development": "black",
    JavaScript: "yellow",
    CSS: "blue",
    Python: "green",
    PHP: "purple",
    Ruby: "red",
  };

  return (
    <div
      className={`px-2 py-1 bg-${colorKey[variant]}-600 text-gray-300 font-bold rounded`}
    >
      {variant}
    </div>
  );
}
