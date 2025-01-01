import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
const SearchPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  fetchLoading,
  handlePagination,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1 || fetchLoading}
            onClick={() => currentPage > 1 && handlePagination(currentPage - 1)}
          />
        </PaginationItem>

        {/* Show first page and ellipsis if needed */}
        {currentPage > 2 && (
          <>
            <PaginationItem>
              <Button
                disabled={fetchLoading}
                onClick={() => handlePagination(1)}
                className="">
                1
              </Button>
            </PaginationItem>
            {currentPage > 3 && <PaginationEllipsis />}
          </>
        )}

        {/* Dynamic Page Buttons (up to 3 pages centered on currentPage) */}
        {[...Array(3)].map((_, index) => {
          const pageNumber = currentPage - 1 + index;
          if (pageNumber < 1 || pageNumber > totalPages) return null;

          return (
            <PaginationItem key={pageNumber}>
              <Button
                disabled={fetchLoading}
                onClick={() => handlePagination(pageNumber)}
                className={
                  currentPage === pageNumber ? "bg-secondary text-white" : ""
                }>
                {fetchLoading && currentPage === pageNumber ? (
                  <Loader className="mx-auto w-6 animate-spin text-white" />
                ) : (
                  pageNumber
                )}
              </Button>
            </PaginationItem>
          );
        })}

        {/* Show last page and ellipsis if needed */}
        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <PaginationEllipsis />}
            <PaginationItem>
              <Button
                disabled={fetchLoading}
                onClick={() => handlePagination(totalPages)}
                className="">
                {totalPages}
              </Button>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            disabled={!hasNextPage || fetchLoading}
            onClick={() => handlePagination(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default SearchPagination;
