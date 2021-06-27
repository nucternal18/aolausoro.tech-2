import Link from 'next/link';

export default function Pagination({ currentPage, numPages }) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = `/blog/page/${currentPage - 1}`;
  const nextPage = `/blog/page/${currentPage + 1}`;

  if (numPages === 1) return <></>;
  return (
    <div className='mt-6'>
      <ul className='flex pl-0 my-2 list-none'>
        {!isFirst && (
          <Link href={prevPage}>
            <li className='relative block px-3 py-2 mr-1 leading-tight text-gray-800 bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200'>
              Previous
            </li>
          </Link>
        )}

        {Array.from({ length: numPages }, (_, i) => (
          <Link href={`/blog/page/${i + 1}`}>
            <li className='relative block px-3 py-2 mr-1 leading-tight text-gray-800 bg-white border border-gray-300 cursor-pointer hover:bg-gray-200'>
              {i + 1}
            </li>
          </Link>
        ))}

        {!isLast && (
          <Link href={nextPage}>
            <li className='relative block px-3 py-2 mr-1 leading-tight text-gray-800 bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200'>
              Next
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
}
