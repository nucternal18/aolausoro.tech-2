"use client";
import React from "react";
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi";
import { useAppSelector, useAppDispatch } from "app/GlobalReduxStore/hooks";
import {
  jobSelector,
  setPage,
} from "app/GlobalReduxStore/features/jobs/jobsSlice";
import { Button } from "./ui/button";

const PageBtnContainer = ({ numberOfPages }: { numberOfPages: number }) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(jobSelector);
  const pages = Array.from({ length: numberOfPages }, (_, i) => i + 1);
  const changePage = (page: number) => {
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
      <Button variant="ghost" onClick={prevPage}>
        <HiChevronDoubleLeft fontSize={21} />
        prev
      </Button>
      <div className="flex flex-row items-center gap-1 bg-teal-300 rounded-md">
        {pages?.map((pageNumber) => {
          return (
            <Button
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
            </Button>
          );
        })}
      </div>
      <Button variant="ghost" onClick={nextPage}>
        next
        <HiChevronDoubleRight fontSize={21} />
      </Button>
    </div>
  );
};

export default PageBtnContainer;
