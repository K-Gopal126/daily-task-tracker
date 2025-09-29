'use client'

import React from 'react'
import { CheckCircle, Circle, Clock, Trash2, AlertCircle } from 'lucide-react'
import { Task } from '@/app/lib/types'
import { CATEGORY_COLORS, PRIORITY_COLORS, formatTime } from '@/app/lib/utils'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface TaskItemProps {
  task: Task
  onToggleCompletion: (taskId: string) => void
  onUpdateTime: (taskId: string, timeSpent: number) => void
  onDelete: (taskId: string) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onUpdateTime,
  onDelete
}) => {
  const [isEditingTime, setIsEditingTime] = React.useState(false)
  const [tempTime, setTempTime] = React.useState(task.timeSpent.toString())

  const handleTimeSubmit = () => {
    const newTime = parseInt(tempTime, 10)
    if (!isNaN(newTime) && newTime >= 0) {
      onUpdateTime(task.id, newTime)
    }
    setIsEditingTime(false)
  }

  const handleTimeCancel = () => {
    setTempTime(task.timeSpent.toString())
    setIsEditingTime(false)
  }

  return (
    <div className={`bg-white rounded-xl p-4 shadow-md border-l-4 ${CATEGORY_COLORS[task.category]} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleCompletion(task.id)}
          className="mt-1 transition-colors"
        >
          {task.completed ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-green-600" />
          )}
        </button>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority === 'high' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                {task.priority.toUpperCase()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                {isEditingTime ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      className="w-20 text-sm"
                      min="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleTimeSubmit()
                        if (e.key === 'Escape') handleTimeCancel()
                      }}
                    />
                    <Button size="sm" onClick={handleTimeSubmit}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={handleTimeCancel}>Cancel</Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingTime(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {formatTime(task.timeSpent)}
                  </button>
                )}
              </div>
              
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {task.category}
              </span>
            </div>
            
            <span className="text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
