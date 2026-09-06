'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MdOutlineDashboard } from 'react-icons/md'

import { currentUserSelector } from '@components/admin-route-components/global-redux-store/features/users/usersSlice'
import { useAppSelector } from '@components/admin-route-components/global-redux-store/hooks'

const AdminNavBar = () => {
  const router = useRouter()
  const currenUser = useAppSelector(currentUserSelector)
  const [pos, setPos] = useState('top')

  // Check the top position of the navigation in the window
  useEffect(() => {
    document.addEventListener('scroll', (e) => {
      const scrolled = document.scrollingElement?.scrollTop
      if ((scrolled as number) >= 1) {
        setPos('moved')
      } else {
        setPos('top')
      }
    })
  }, [])
  return (
    <nav className="hidden w-full gap-2 p-6 font-mono shadow-xl md:flex md:gap-5">
      <div className="flex items-center justify-center text-gray-800 dark:text-gray-200 dark:hover:text-yellow-500">
        <MdOutlineDashboard fontSize={28} className="mr-2" />
        <h1 className="font text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex w-full items-center justify-end rounded-md border-none px-2 text-gray-800 outline-none focus-within:shadow-sm dark:text-gray-200 dark:hover:text-yellow-500">
        {currenUser && (
          <button
            type="button"
            className="flex items-center rounded-3xl bg-gray-800 px-4 py-2 text-gray-200 shadow-xl dark:bg-yellow-500"
            onClick={() => router.push(`/user-profile/${currenUser?.id}`)}
          >
            <p className="mr-2 text-base capitalize">{currenUser.name}</p>
            <img src={currenUser.image} alt="user-profile" className="h-8 w-8 rounded-full" />
          </button>
        )}
      </div>
    </nav>
  )
}

export default AdminNavBar
