'use client'

import React from 'react'
import { Task } from '@/app/lib/types'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onUpdateTime: (taskId: string, timeSpent: number) => void
  onDelete: (taskId: string) => void
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleCompletion,
  onUpdateTime,
  onDelete
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md text-center">
        <div className="text-gray-400 text-lg">No tasks for today</div>
        <p className="text-gray-500 text-sm mt-2">Click "Add Task" to get started!</p>
      </div>
    )
  }

  // Sort tasks: incomplete first, then by priority, then by creation time
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority]
    }
    
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onUpdateTime={onUpdateTime}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

