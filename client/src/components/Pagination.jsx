function Pagination({ currentPage, totalPages, onPageChange }) {
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
    <div className="pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`btn ${currentPage === 1 ? "btn-secondary" : "btn-primary"}`}
        style={{
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          minWidth: "auto",
          padding: "0.75rem 1.5rem",
        }}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pageNumberArray.map((number, index) => {
          if (number === null) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-muted flex-center"
                style={{
                  minWidth: "2.5rem",
                  height: "2.5rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`btn ${
                currentPage === number ? "btn-primary active" : "btn-secondary"
              }`}
              style={{
                minWidth: "2.5rem",
                height: "2.5rem",
                padding: "0",
                fontWeight: currentPage === number ? "600" : "400",
                background:
                  currentPage === number
                    ? "linear-gradient(45deg, var(--primary), var(--primary-hover))"
                    : "rgba(255, 255, 255, 0.1)",
                color: currentPage === number ? "white" : "var(--text-primary)",
                transform: currentPage === number ? "scale(1.1)" : "scale(1)",
              }}
              aria-label={`Page ${number}`}
              aria-current={currentPage === number ? "page" : undefined}
            >
              {number}
            </button>
          );
        })}
      </div>

      {/* Dropdown for many pages */}
      {totalPages > 6 && (
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="form-input"
          style={{
            width: "120px",
            padding: "0.5rem",
            fontSize: "0.875rem",
          }}
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
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`btn ${
          currentPage === totalPages ? "btn-secondary" : "btn-primary"
        }`}
        style={{
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          minWidth: "auto",
          padding: "0.75rem 1.5rem",
        }}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
