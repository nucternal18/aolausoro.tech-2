import React from "react";
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi";
import { useAppSelector, useAppDispatch } from "app/GlobalReduxStore/hooks";
import {
  jobSelector,
  setPage,
} from "app/GlobalReduxStore/features/jobs/jobsSlice";

const PageBtnContainer = ({ numberOfPages }) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(jobSelector);
  const pages = Array.from({ length: numberOfPages }, (_, i) => i + 1);
  const changePage = (page) => {
    dispatch(setPage(page));
  };
  const prevPage = () => {
    console.log("prev page");
    let newPage = state.page - 1;
    if (newPage < 1) {
      newPage = numberOfPages;
    }
    changePage(newPage);
  };
  const nextPage = () => {
    console.log("next page");
    let newPage = state.page + 1;
    if (newPage > numberOfPages) {
      newPage = 1;
    }
    changePage(newPage);
  };
  return (
    <div className="font-mono flex flex-row items-center gap-2 ">
      <button
        className="flex flex-row p-2 items-center text-white gap-2 bg-teal-500 active:bg-teal-500 hover:bg-teal-600 rounded-l-md shadow-md"
        onClick={prevPage}
      >
        <HiChevronDoubleLeft fontSize={21} />
        prev
      </button>
      <div className="flex flex-row items-center gap-1 bg-teal-300 rounded-md">
        {pages?.map((pageNumber) => {
          return (
            <button
              type="button"
              className={`${
                pageNumber === state.page
                  ? "bg-teal-800 text-white rounded-md"
                  : "bg-teal-300 text-white"
              } py-2 px-4 gap-2  hover:bg-teal-400 shadow-md`}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button
        className="flex flex-row p-2 items-center text-white gap-2 bg-teal-500 hover:bg-teal-600 rounded-r-md shadow-md"
        onClick={nextPage}
      >
        next
        <HiChevronDoubleRight fontSize={21} />
      </button>
    </div>
  );
};

export default PageBtnContainer;
