// FilterBar.jsx - filtering and search controls
export default function FilterBar({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  dueBefore,
  setDueBefore,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <label>
          Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Completed</option>
            <option>Incomplete</option>
          </select>
        </label>

        <label>
          Priority:
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Due before:
          <input
            type="date"
            value={dueBefore}
            onChange={(e) => setDueBefore(e.target.value)}
          />
        </label>
      </div>

      <div className="filter-row">
        <input
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => {
          // quick clear
          setStatusFilter("All");
          setPriorityFilter("All");
          setDueBefore("");
          setSearchTerm("");
        }}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}
