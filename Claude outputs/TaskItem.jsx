import React from 'react';

function TaskItem({ task, onComplete, onStatusChange, onSelect, isSelected }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'in-progress': return '#3498db';
      case 'pending': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'completed';
  };

  const daysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: isSelected ? '#ecf0f1' : 'white',
        border: `2px solid ${isSelected ? '#3498db' : '#e0e0e0'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        hover: {
          backgroundColor: '#f8f9fa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
      onClick={() => onSelect && onSelect(task.id)}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={(e) => {
          e.stopPropagation();
          if (e.target.checked) {
            onComplete(task.id);
          } else {
            onStatusChange(task.id, 'pending');
          }
        }}
        style={{
          cursor: 'pointer',
          width: '20px',
          height: '20px',
        }}
      />

      {/* Priority Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: getPriorityColor(task.priority),
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 'bold',
        }}
        title={`Priority: ${task.priority.toUpperCase()}`}
      >
        {task.priority === 'high' ? '!' : task.priority === 'medium' ? '◉' : '○'}
      </div>

      {/* Task Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: '500',
            color: task.status === 'completed' ? '#95a5a6' : '#2c3e50',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            marginBottom: '0.25rem',
          }}
        >
          {task.description}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: '#7f8c8d',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {task.transactionId && (
            <span style={{ opacity: 0.7 }}>Txn: {task.transactionId}</span>
          )}
          <span style={{ opacity: 0.7 }}>Due: {formatDate(task.dueDate)}</span>
          {isOverdue() && (
            <span
              style={{
                color: '#e74c3c',
                fontWeight: '600',
              }}
            >
              OVERDUE ({Math.abs(daysUntilDue())} days)
            </span>
          )}
          {!isOverdue() && task.status !== 'completed' && daysUntilDue() <= 7 && (
            <span
              style={{
                color: '#f39c12',
                fontWeight: '600',
              }}
            >
              Due in {daysUntilDue()} days
            </span>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: getStatusColor(task.status),
            color: 'white',
            fontWeight: '600',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}

export default TaskItem;
