'use client'

import React from 'react'
import { BarChart3, Clock, CheckCircle, Target, TrendingUp } from 'lucide-react'
import { DailyStats as DailyStatsType, Task } from '@/app/lib/types'
import { CATEGORY_COLORS, CATEGORY_LABELS, formatTime } from '@/app/lib/utils'

interface DailyStatsProps {
  stats: DailyStatsType
  tasks: Task[]
}

export const DailyStats: React.FC<DailyStatsProps> = ({ stats, tasks }) => {
  const categoryStats = React.useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { time: 0, count: 0, completed: 0 }
      }
      acc[task.category].time += task.timeSpent
      acc[task.category].count += 1
      if (task.completed) {
        acc[task.category].completed += 1
      }
      return acc
    }, {} as Record<string, { time: number; count: number; completed: number }>)
  }, [tasks])

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Time</p>
              <p className="text-2xl font-bold text-gray-800">{formatTime(stats.totalTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Category Breakdown
        </h3>
        
        <div className="space-y-4">
          {Object.entries(categoryStats).map(([category, data]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}></div>
                  <span className="font-medium text-gray-700">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-4">
                  <span>{data.completed}/{data.count} tasks</span>
                  <span>{formatTime(data.time)}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}
                  style={{
                    width: `${stats.totalTime > 0 ? (data.time / stats.totalTime) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Productive Category */}
      {stats.mostProductiveCategory && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🏆 Most Productive Category</h3>
          <p className="text-gray-600">
            You spent the most time on{' '}
            <span className="font-semibold text-blue-700">
              {CATEGORY_LABELS[stats.mostProductiveCategory as keyof typeof CATEGORY_LABELS]}
            </span>{' '}
            today!
          </p>
        </div>
      )}
    </div>
  )
}