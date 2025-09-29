'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Minus, Save, RotateCcw, TrendingUp, TrendingDown, Home } from 'lucide-react'
import Link from 'next/link'

interface StrengthWeaknessEntry {
  id: string
  strength: string
  weakness: string
  date: string
}

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default function StrengthsWeaknessesPage() {
  const [entries, setEntries] = useState<StrengthWeaknessEntry[]>([
    { id: '1', strength: '', weakness: '', date: new Date().toISOString().split('T')[0] }
  ])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage?.getItem('strengthsWeaknesses')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setEntries(parsedData.entries || [{ id: '1', strength: '', weakness: '', date: new Date().toISOString().split('T')[0] }])
        setLastSaved(parsedData.lastSaved ? new Date(parsedData.lastSaved) : null)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
  }, [])

  // Auto-save functionality
  const saveData = () => {
    const dataToSave = {
      entries,
      lastSaved: new Date().toISOString()
    }
    localStorage?.setItem('strengthsWeaknesses', JSON.stringify(dataToSave))
    setLastSaved(new Date())
  }

  const addRow = () => {
    const newEntry: StrengthWeaknessEntry = {
      id: Date.now().toString(),
      strength: '',
      weakness: '',
      date: new Date().toISOString().split('T')[0]
    }
    setEntries(prev => [...prev, newEntry])
  }

  const removeRow = (id: string) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter(entry => entry.id !== id))
    }
  }

  const updateEntry = (id: string, field: 'strength' | 'weakness', value: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all entries?')) {
      setEntries([{ id: Date.now().toString(), strength: '', weakness: '', date: new Date().toISOString().split('T')[0] }])
    }
  }

  const getStats = () => {
    const totalStrengths = entries.filter(entry => entry.strength.trim()).length
    const totalWeaknesses = entries.filter(entry => entry.weakness.trim()).length
    const completedEntries = entries.filter(entry => entry.strength.trim() && entry.weakness.trim()).length
    return { totalStrengths, totalWeaknesses, completedEntries, totalEntries: entries.length }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <TrendingUp className="text-green-600" />
                Work Strengths & Weaknesses
              </h1>
              <p className="text-gray-600 mt-2">
                Track what you accomplished vs what you couldn't achieve
              </p>
            </div>
            <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Tasks
            </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-semibold">{stats.totalStrengths}</p>
                  <p className="text-green-600 text-sm">Strengths Listed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-semibold">{stats.totalWeaknesses}</p>
                  <p className="text-red-600 text-sm">Weaknesses Listed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-800 font-semibold">{stats.completedEntries}</p>
                  <p className="text-blue-600 text-sm">Complete Entries</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-800 font-semibold">{entries.length}</p>
                  <p className="text-gray-600 text-sm">Total Rows</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={addRow} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Row
            </Button>
            <Button onClick={saveData} variant="secondary" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Progress
            </Button>
            <Button onClick={clearAll} variant="primary" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
          </div>

          {lastSaved && (
            <p className="text-sm text-gray-500 mt-2">
              Last saved: {lastSaved.toLocaleString()}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-red-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <TrendingUp className="w-5 h-5" />
                      What I Accomplished (Strengths)
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-red-700 font-semibold">
                      <TrendingDown className="w-5 h-5" />
                      What I Couldn't Achieve (Weaknesses)
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center w-20">
                    <span className="text-gray-600 font-semibold">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <textarea
                        value={entry.strength}
                        onChange={(e) => updateEntry(entry.id, 'strength', e.target.value)}
                        placeholder="List what you accomplished today..."
                        rows={3}
                        className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-green-50/30"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={entry.weakness}
                        onChange={(e) => updateEntry(entry.id, 'weakness', e.target.value)}
                        placeholder="List what you couldn't achieve..."
                        rows={3}
                        className="w-full p-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-red-50/30"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        onClick={() => removeRow(entry.id)}
                        variant="ghost"
                        size="sm"
                        disabled={entries.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Effective Self-Reflection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">For Strengths:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Completed tasks and projects</li>
                <li>Skills you used effectively</li>
                <li>Problems you solved</li>
                <li>Positive feedback received</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Weaknesses:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Tasks left incomplete</li>
                <li>Skills you need to improve</li>
                <li>Challenges you faced</li>
                <li>Areas for future development</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}