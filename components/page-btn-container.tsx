'use client'
import React from 'react'
import { HiChevronDoubleRight, HiChevronDoubleLeft } from 'react-icons/hi'
import {
  useAppSelector,
  useAppDispatch,
} from '@components/admin-route-components/global-redux-store/hooks'
import {
  jobSelector,
  setPage,
} from '@components/admin-route-components/global-redux-store/features/jobs/jobsSlice'
import { Button } from './ui/button'

const PageBtnContainer = ({ numberOfPages }: { numberOfPages: number }) => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(jobSelector)
  const pages = Array.from({ length: numberOfPages }, (_, i) => i + 1)
  const changePage = (page: number) => {
    dispatch(setPage(page))
  }
  const prevPage = () => {
    let newPage = state.page - 1
    if (newPage < 1) {
      newPage = numberOfPages
    }
    changePage(newPage)
  }
  const nextPage = () => {
    let newPage = state.page + 1
    if (newPage > numberOfPages) {
      newPage = 1
    }
    changePage(newPage)
  }
  return (
    <div className="flex flex-row items-center gap-2 font-mono">
      <Button disabled={!(state.page > 1)} variant="ghost" onClick={prevPage}>
        <HiChevronDoubleLeft fontSize={21} />
        prev
      </Button>
      <div className="flex flex-row items-center gap-1 rounded-md bg-teal-300">
        {pages?.map((pageNumber) => {
          return (
            <Button
              type="button"
              className={`${
                pageNumber === state.page
                  ? 'rounded-md bg-teal-800 text-white'
                  : 'bg-teal-300 text-white'
              } gap-2 px-4 py-2 shadow-md hover:bg-teal-400`}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>
      <Button disabled={!(state.page > 1)} variant="ghost" onClick={nextPage}>
        next
        <HiChevronDoubleRight fontSize={21} />
      </Button>
    </div>
  )
}

export default PageBtnContainer
