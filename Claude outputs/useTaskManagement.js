// Custom hook for task management logic
import { useState, useEffect } from 'react';
import { mockTasks, getTasksByAssignee, getUpcomingTasks, getOverdueTasks } from '../data/mockTasks';

export const useTaskManagement = (userId, filterOptions = {}) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, in-progress, completed
    priority: 'all', // all, high, medium, low
    sortBy: 'dueDate', // dueDate, priority, status
    dateRange: 'all', // all, overdue, upcoming, week
    searchTerm: '',
  });

  // Load tasks for user
  useEffect(() => {
    if (userId) {
      const userTasks = getTasksByAssignee(userId);
      setTasks(userTasks);
    }
  }, [userId]);

  // Apply filters
  useEffect(() => {
    let result = [...tasks];

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Filter by date range
    const today = new Date();
    if (filters.dateRange === 'overdue') {
      result = result.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate < today && t.status !== 'completed';
      });
    } else if (filters.dateRange === 'upcoming') {
      result = result.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && t.status !== 'completed';
      });
    } else if (filters.dateRange === 'week') {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      result = result.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate <= weekFromNow && t.status !== 'completed';
      });
    }

    // Search by description or transaction ID
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.transactionId?.toLowerCase().includes(term) ||
        t.type.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (filters.sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (filters.sortBy === 'status') {
        const statusOrder = { 'in-progress': 0, pending: 1, completed: 2 };
        return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
      }
      return 0;
    });

    setFilteredTasks(result);
  }, [tasks, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId
        ? { ...t, status: 'completed', completedDate: new Date().toISOString() }
        : t
    );
    setTasks(updatedTasks);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus }
        : t
    );
    setTasks(updatedTasks);
  };

  const getOverdueCount = () => {
    const today = new Date();
    return tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < today && t.status !== 'completed';
    }).length;
  };

  const getUpcomingCount = () => {
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate <= weekFromNow && t.status !== 'completed';
    }).length;
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status);
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    updateFilter,
    completeTask,
    updateTaskStatus,
    getOverdueCount,
    getUpcomingCount,
    getTasksByStatus,
  };
};
