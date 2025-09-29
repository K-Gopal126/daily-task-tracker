import { Task } from './types'

const STORAGE_KEY = 'dailyWorkTracker_tasks'

export const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY)
    return savedTasks ? JSON.parse(savedTasks) : []
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

export const clearAllTasks = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing tasks:', error)
  }
}
