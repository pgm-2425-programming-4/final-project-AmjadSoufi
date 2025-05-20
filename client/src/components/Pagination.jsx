export function Pagination({ currentPage, totalPages, onPageChange }) {
  let pageNumberArray;

  if (totalPages <= 6) {
    pageNumberArray = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumberArray.push(i + 1);
    }
  } else if (currentPage > 3 && currentPage < totalPages - 2) {
    pageNumberArray = [
      1,
      null,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      null,
      totalPages,
    ];
  } else if (currentPage <= 3) {
    pageNumberArray = [1, 2, 3, 4, null, totalPages];
  } else {
    pageNumberArray = [
      1,
      null,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  const allPages = [];
  for (let i = 1; i <= totalPages; i++) {
    allPages.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-4 w-28">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-full px-3 py-1 mb-2 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="flex flex-col items-center w-full mb-2">
        {pageNumberArray.map((number, index) => {
          if (number === null) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-center w-full"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`w-full px-3 py-1 my-1 rounded ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Page ${number}`}
              aria-current={currentPage === number ? "page" : undefined}
            >
              {number}
            </button>
          );
        })}
      </div>

      {totalPages > 6 && (
        <div className="w-full mb-2">
          <select
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className="w-full px-2 py-1 border border-gray-300 rounded bg-white"
            aria-label="Go to specific page"
          >
            <option value="" disabled>
              Go to...
            </option>
            {allPages.map((page) => (
              <option key={page} value={page}>
                Page {page}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-full px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
