'use client'

import React from 'react'
import { Plus, X } from 'lucide-react'
import { NewTask, TaskCategory, TaskPriority } from '@/app/lib/types'
import { CATEGORY_LABELS } from '@/app/lib/utils'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: NewTask) => void
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState<NewTask>({
    title: '',
    description: '',
    timeSpent: 0,
    category: 'work',
    priority: 'medium'
  })

  const [errors, setErrors] = React.useState<Partial<Record<keyof NewTask, string>>>({})

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as TaskCategory,
    label
  }))

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewTask, string>> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (formData.timeSpent < 0) {
      newErrors.timeSpent = 'Time spent cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        title: '',
        description: '',
        timeSpent: 0,
        category: 'work',
        priority: 'medium'
      })
      setErrors({})
      onClose()
    }
  }

  const handleChange = (field: keyof NewTask, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevent modal from closing when clicking inside the form
    e.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm pointer-events-none">
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 pointer-events-auto"
        onClick={handleModalClick}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Add New Task
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter task title..."
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add task description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <Input
            label="Time Spent (minutes)"
            type="number"
            value={formData.timeSpent.toString()}
            onChange={(e) => handleChange('timeSpent', parseInt(e.target.value, 10) || 0)}
            placeholder="0"
            min="0"
            error={errors.timeSpent}
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value as TaskCategory)}
            options={categoryOptions}
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
            options={priorityOptions}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Task
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}