import Link from 'next/link'

export default function Pagination({
  currentPage,
  numPages,
}: {
  currentPage: number
  numPages: number
}) {
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = `/blog/page/${currentPage - 1}`
  const nextPage = `/blog/page/${currentPage + 1}`

  if (numPages === 1) return <></>
  return (
    <div className="mt-6">
      <ul className="my-2 flex list-none pl-0">
        {!isFirst && (
          <Link href={prevPage}>
            <li className="relative mr-1 block cursor-pointer border border-gray-300 bg-gray-100 px-3 py-2 leading-tight text-gray-800 hover:bg-gray-200">
              Previous
            </li>
          </Link>
        )}

        {Array.from({ length: numPages }, (_, i) => (
          <Link key={`${i + 1}`} href={`/blog/page/${i + 1}`}>
            <li className="relative mr-1 block cursor-pointer border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-800 hover:bg-gray-200">
              {i + 1}
            </li>
          </Link>
        ))}

        {!isLast && (
          <Link href={nextPage}>
            <li className="relative mr-1 block cursor-pointer border border-gray-300 bg-gray-100 px-3 py-2 leading-tight text-gray-800 hover:bg-gray-200">
              Next
            </li>
          </Link>
        )}
      </ul>
    </div>
  )
}
