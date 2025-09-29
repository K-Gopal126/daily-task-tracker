import { Task, DailyStats, TaskCategory } from './types'

export const CATEGORY_COLORS = {
  work: 'bg-blue-500',
  learning: 'bg-green-500',
  meetings: 'bg-purple-500',
  admin: 'bg-orange-500',
  break: 'bg-gray-500'
} as const

export const CATEGORY_LABELS = {
  work: 'Work Tasks',
  learning: 'Learning',
  meetings: 'Meetings',
  admin: 'Administrative',
  break: 'Break/Rest'
} as const

export const PRIORITY_COLORS = {
  low: 'bg-gray-200 text-gray-700',
  medium: 'bg-yellow-200 text-yellow-800',
  high: 'bg-red-200 text-red-800'
} as const

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const calculateDailyStats = (tasks: Task[]): DailyStats => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTime = tasks.reduce((sum, task) => sum + task.timeSpent, 0)
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const categoryTime = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + task.timeSpent
    return acc
  }, {} as Record<TaskCategory, number>)
  
  const mostProductiveCategory = Object.entries(categoryTime).reduce(
    (max, [category, time]) => time > max.time ? { category, time } : max,
    { category: 'work', time: 0 }
  ).category

  return {
    totalTasks,
    completedTasks,
    totalTime,
    mostProductiveCategory,
    completionRate
  }
}

export const generateTaskId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0]
}