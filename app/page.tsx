// ===== app/page.tsx =====
'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Calendar, BarChart3, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Task, NewTask } from '@/app/lib/types'
import { generateTaskId, getCurrentDate, calculateDailyStats, formatDate } from '@/app/lib/utils'
import { loadTasks, saveTasks } from '@/app/lib/storage'
import { Button } from '@/app/components/ui/Button'
import { TaskForm } from '@/app/components/TaskForm'
import { TaskList } from '@/app/components/TaskList'
import { DailyStats } from '@/app/components/DailyStats'

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate())
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'stats'>('tasks')

  // Load tasks on component mount
  useEffect(() => {
    const savedTasks = loadTasks()
    setTasks(savedTasks)
  }, [])

  // Save tasks whenever tasks array changes
  useEffect(() => {
    if (tasks.length >= 0) {
      saveTasks(tasks)
    }
  }, [tasks])

  // Filter tasks for selected date
  const todaysTasks = tasks.filter(task => task.date === selectedDate)
  const dailyStats = calculateDailyStats(todaysTasks)

  const handleAddTask = (newTaskData: NewTask) => {
    const newTask: Task = {
      ...newTaskData,
      id: generateTaskId(),
      completed: false,
      date: selectedDate,
      createdAt: new Date().toISOString()
    }

    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const handleToggleCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleUpdateTime = (taskId: string, timeSpent: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, timeSpent } : task
      )
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Calendar className="text-blue-600" />
                Daily Work Tracker
              </h1>
              <p className="text-gray-600 mt-1">{formatDate(selectedDate)}</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Link href="/strengths-weaknesses">
                <Button variant="secondary" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Strengths & Weaknesses
                </Button>
              </Link>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'tasks' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('tasks')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Today's Tasks ({todaysTasks.length})
            </Button>
            <Button
              variant={activeTab === 'stats' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('stats')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Daily Stats
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-xl font-bold text-gray-800">{dailyStats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-xl font-bold text-gray-800">{dailyStats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Time Spent</p>
                <p className="text-xl font-bold text-gray-800">{dailyStats.totalTime}m</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completion</p>
                <p className="text-xl font-bold text-gray-800">{dailyStats.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === 'tasks' ? (
            <TaskList
              tasks={todaysTasks}
              onToggleCompletion={handleToggleCompletion}
              onUpdateTime={handleUpdateTime}
              onDelete={handleDeleteTask}
            />
          ) : (
            <DailyStats stats={dailyStats} tasks={todaysTasks} />
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleAddTask}
        />
      </div>
    </div>
  )
}