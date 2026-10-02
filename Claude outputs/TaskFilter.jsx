import React from 'react';

function TaskFilter({ filters, onFilterChange }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      padding: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      marginBottom: '1.5rem',
    }}>
      {/* Status Filter */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '0.9rem',
        }}>
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '0.9rem',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '0.9rem',
        }}>
          Priority
        </label>
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '0.9rem',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '0.9rem',
        }}>
          Date Range
        </label>
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange('dateRange', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '0.9rem',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '0.9rem',
        }}>
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '0.9rem',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Search Filter */}
      <div
        style={{
          gridColumn: 'span 1',
        }}
      >
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '0.9rem',
        }}>
          Search
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          placeholder="Search tasks..."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}

export default TaskFilter;
