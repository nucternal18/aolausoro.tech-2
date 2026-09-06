export default function CategoryLabel({ variant }: { variant: string }) {
  const colorKey: { [key: string]: string } = {
    'Web Development': 'black',
    JavaScript: 'yellow',
    CSS: 'blue',
    Python: 'green',
    PHP: 'purple',
    Ruby: 'red',
  }

  return (
    <div className={`px-2 py-1 bg-${colorKey[variant]}-600 rounded font-bold text-gray-300`}>
      {variant}
    </div>
  )
}
