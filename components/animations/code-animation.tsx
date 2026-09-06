import { useEffect, useRef, useState } from 'react'

export function CodeAnimation() {
  const [text, setText] = useState('')
  const fullText = `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText((prev) => prev + fullText.charAt(i))
        i++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => setText(''), 2000) // Clear text after 2 seconds
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gray-900 p-4">
      <pre className="font-mono text-sm whitespace-pre-wrap text-green-400 md:text-base">
        <code>{text}</code>
      </pre>
    </div>
  )
}
