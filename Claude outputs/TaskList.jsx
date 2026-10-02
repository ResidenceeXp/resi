import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import { useTaskManagement } from '../hooks/useTaskManagement';

function TaskList({ currentUser }) {
  const {
    tasks,
    allTasks,
    filters,
    updateFilter,
    completeTask,
    updateTaskStatus,
    getOverdueCount,
    getUpcomingCount,
    getTasksByStatus,
  } = useTaskManagement(currentUser.id);

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const overdueCount = getOverdueCount();
  const upcomingCount = getUpcomingCount();
  const completedCount = getTasksByStatus('completed').length;

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '1rem',
      }}>
        <h1 style={{
          margin: '0 0 0.5rem 0',
          color: '#2c3e50',
        }}>
          My Tasks
        </h1>
        <p style={{
          margin: 0,
          color: '#7f8c8d',
        }}>
          Manage your workflow and deadlines
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}>
            {overdueCount}
          </div>
          <div style={{
            fontSize: '0.85rem',
            opacity: 0.9,
          }}>
            Overdue
          </div>
        </div>

        <div style={{
          backgroundColor: '#f39c12',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}>
            {upcomingCount}
          </div>
          <div style={{
            fontSize: '0.85rem',
            opacity: 0.9,
          }}>
            Due This Week
          </div>
        </div>

        <div style={{
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}>
            {completedCount}
          </div>
          <div style={{
            fontSize: '0.85rem',
            opacity: 0.9,
          }}>
            Completed
          </div>
        </div>

        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}>
            {allTasks.length}
          </div>
          <div style={{
            fontSize: '0.85rem',
            opacity: 0.9,
          }}>
            Total Tasks
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <TaskFilter filters={filters} onFilterChange={updateFilter} />

      {/* Tasks List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {tasks.length > 0 ? (
          <>
            <div style={{
              color: '#7f8c8d',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
            }}>
              Showing {tasks.length} of {allTasks.length} tasks
            </div>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={completeTask}
                onStatusChange={updateTaskStatus}
                onSelect={setSelectedTaskId}
                isSelected={selectedTaskId === task.id}
              />
            ))}
          </>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            color: '#7f8c8d',
          }}>
            No tasks found matching your filters
          </div>
        )}
      </div>

      {/* Task Detail Panel (Optional) */}
      {selectedTaskId && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#ecf0f1',
          borderRadius: '6px',
          borderLeft: '4px solid #3498db',
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#2c3e50',
          }}>
            Task Details
          </h3>
          {tasks.find(t => t.id === selectedTaskId) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              color: '#2c3e50',
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Description
                </div>
                <div>{tasks.find(t => t.id === selectedTaskId).description}</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Status
                </div>
                <div style={{ textTransform: 'capitalize' }}>
                  {tasks.find(t => t.id === selectedTaskId).status}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Priority
                </div>
                <div style={{ textTransform: 'capitalize' }}>
                  {tasks.find(t => t.id === selectedTaskId).priority}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Due Date
                </div>
                <div>
                  {new Date(tasks.find(t => t.id === selectedTaskId).dueDate).toLocaleDateString()}
                </div>
              </div>
              {tasks.find(t => t.id === selectedTaskId).transactionId && (
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Transaction
                  </div>
                  <div>{tasks.find(t => t.id === selectedTaskId).transactionId}</div>
                </div>
              )}
              {tasks.find(t => t.id === selectedTaskId).type && (
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Task Type
                  </div>
                  <div>{tasks.find(t => t.id === selectedTaskId).type}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskList;
