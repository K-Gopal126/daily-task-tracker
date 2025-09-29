export interface Task {
  id: string
  title: string
  description: string
  timeSpent: number
  completed: boolean
  date: string
  category: 'work' | 'learning' | 'meetings' | 'admin' | 'break'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface DailyStats {
  totalTasks: number
  completedTasks: number
  totalTime: number
  mostProductiveCategory: string
  completionRate: number
}

export interface NewTask {
  title: string
  description: string
  timeSpent: number
  category: Task['category']
  priority: Task['priority']
}

export type TaskCategory = Task['category']
export type TaskPriority = Task['priority']