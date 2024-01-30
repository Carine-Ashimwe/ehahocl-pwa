import { CardFooter, Pagination, PaginationItem, PaginationLink } from "reactstrap";

const TablePagination = ({
    page,
    isLoading,
    isError,
    error,
    totalPages,
    handlePageClick,
}: {
    page: number;
    isLoading: boolean;
    isError: boolean;
    error: any;
    totalPages: number;
    handlePageClick: any;
}) => {
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 5) {
            // Display all page numbers
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Display page numbers with ellipsis
            const startPage = Math.max(1, page - 2);
            const endPage = Math.min(totalPages, startPage + 4);

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push("...");
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push("...");
                }
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <>
            {isLoading ? (
                <td colSpan={10}>Loading available pages...</td>
            ) : isError ? (
                <td colSpan={10}>Error: {error.message}</td>
            ) : (
                <CardFooter className="py-4">
                    <nav aria-label="...">
                        <Pagination
                            className="pagination justify-content-end mb-0"
                            listClassName="justify-content-end mb-0"
                        >
                            <PaginationItem className={page === 1 ? "disabled" : ""}>
                                <PaginationLink
                                    href="#pablo"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageClick(page - 1);
                                    }}
                                    tabIndex={-1}
                                >
                                    <i className="fas fa-angle-left" />
                                    <span className="sr-only">Previous</span>
                                </PaginationLink>
                            </PaginationItem>

                            {/* First Page Button */}
                            <PaginationItem className={page === 1 ? "disabled" : ""} disabled={totalPages === 0}>
                                <PaginationLink
                                    href="#pablo"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageClick(1);
                                    }}
                                >
                                    First
                                </PaginationLink>
                            </PaginationItem>

                            {/* Display the page numbers dynamically */}
                            {getPageNumbers().map((pageNumber, index) => (
                                <PaginationItem
                                    key={index}
                                    className={pageNumber === page ? "active" : ""}
                                >
                                    <PaginationLink
                                        href="#pablo"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (typeof pageNumber === "number") {
                                                handlePageClick(pageNumber);
                                            }
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {/* Last Page Button */}
                            <PaginationItem className={page === totalPages ? "disabled" : ""} disabled={totalPages === 0}>
                                <PaginationLink
                                    href="#pablo"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageClick(totalPages);
                                    }}
                                >
                                    Last
                                </PaginationLink>
                            </PaginationItem>

                            <PaginationItem className={page === totalPages ? "disabled" : ""}>
                                <PaginationLink
                                    href="#pablo"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageClick(page + 1);
                                    }}
                                >
                                    <i className="fas fa-angle-right" />
                                    <span className="sr-only">Next</span>
                                </PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </nav>
                </CardFooter>
            )}
        </>
    );
};

export default TablePagination;
    