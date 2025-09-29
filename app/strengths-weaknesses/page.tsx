'use client'

import React, { useState, useEffect } from 'react'
import { Save, RotateCcw, Home, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface DiaryEntry {
  id: string
  date: string
  strengthsText: string
  weaknessesText: string
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
  const baseClasses = 'font-medium rounded transition-colors duration-200 focus:outline-none'
  
  const variantClasses = {
    primary: 'bg-amber-700 hover:bg-amber-800 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5'
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

export default function PaperDiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (entries.length === 0) {
      setEntries([{
        id: Date.now().toString(),
        date: selectedDate,
        strengthsText: '',
        weaknessesText: ''
      }])
    }
  }, [])

  const getCurrentEntry = (): DiaryEntry => {
    const entry = entries.find(e => e.date === selectedDate)
    if (entry) return entry
    
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      strengthsText: '',
      weaknessesText: ''
    }
    setEntries(prev => [...prev, newEntry])
    return newEntry
  }

  const currentEntry = getCurrentEntry()

  const updateStrengths = (value: string) => {
    setEntries(prev => prev.map(entry => 
      entry.date === selectedDate 
        ? { ...entry, strengthsText: value }
        : entry
    ))
  }

  const updateWeaknesses = (value: string) => {
    setEntries(prev => prev.map(entry => 
      entry.date === selectedDate 
        ? { ...entry, weaknessesText: value }
        : entry
    ))
  }

  const saveData = () => {
    setLastSaved(new Date())
    alert('Diary saved successfully!')
  }

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all diary entries?')) {
      setEntries([{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        strengthsText: '',
        weaknessesText: ''
      }])
      setSelectedDate(new Date().toISOString().split('T')[0])
    }
  }

  const changeDate = (days: number) => {
    const currentDate = new Date(selectedDate + 'T00:00:00')
    currentDate.setDate(currentDate.getDate() + days)
    setSelectedDate(currentDate.toISOString().split('T')[0])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  const getMonthYear = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getDay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.getDate()
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button onClick={saveData} variant="primary" size="sm" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button onClick={clearAll} variant="secondary" size="sm" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Diary Book */}
        <div className="bg-amber-100 rounded-lg shadow-2xl p-8 border-4 border-amber-900" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, #d4a574 31px, #d4a574 32px)`,
        }}>
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-amber-800">
            <button 
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-amber-200 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-amber-900" />
            </button>
            
            <div className="text-center">
              <div className="text-amber-900 font-bold text-3xl font-serif">
                {getDay(selectedDate)}
              </div>
              <div className="text-amber-800 font-semibold text-lg font-serif">
                {getDayOfWeek(selectedDate)}
              </div>
              <div className="text-amber-700 text-sm font-serif">
                {getMonthYear(selectedDate)}
              </div>
            </div>
            
            <button 
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-amber-200 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-amber-900" />
            </button>
          </div>

          {/* Diary Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Page - Strengths */}
            <div className="relative">
              <div className="bg-yellow-50 rounded shadow-lg p-6 min-h-[500px]" style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5b7 31px, #e5d5b7 32px)`,
                lineHeight: '32px'
              }}>
                <div className="mb-4 pb-2 border-b border-green-600">
                  <h2 className="text-green-700 font-bold text-xl font-serif">
                    ✓ What I Accomplished
                  </h2>
                </div>
                <textarea
                  value={currentEntry.strengthsText}
                  onChange={(e) => updateStrengths(e.target.value)}
                  placeholder="Write your accomplishments here..."
                  className="w-full h-[400px] bg-transparent border-none focus:outline-none resize-none font-handwriting text-gray-800 text-base"
                  style={{
                    lineHeight: '32px',
                    fontFamily: "'Kalam', cursive"
                  }}
                />
              </div>
              {/* Page curl effect */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-100 transform rotate-45 translate-x-8 translate-y-8 shadow-xl"></div>
            </div>

            {/* Right Page - Weaknesses */}
            <div className="relative">
              <div className="bg-yellow-50 rounded shadow-lg p-6 min-h-[500px]" style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5b7 31px, #e5d5b7 32px)`,
                lineHeight: '32px'
              }}>
                <div className="mb-4 pb-2 border-b border-red-600">
                  <h2 className="text-red-700 font-bold text-xl font-serif">
                    ✗ What I Couldn't Achieve
                  </h2>
                </div>
                <textarea
                  value={currentEntry.weaknessesText}
                  onChange={(e) => updateWeaknesses(e.target.value)}
                  placeholder="Write what you couldn't achieve here..."
                  className="w-full h-[400px] bg-transparent border-none focus:outline-none resize-none font-handwriting text-gray-800 text-base"
                  style={{
                    lineHeight: '32px',
                    fontFamily: "'Kalam', cursive"
                  }}
                />
              </div>
              {/* Page curl effect */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-100 transform rotate-45 translate-x-8 translate-y-8 shadow-xl"></div>
            </div>
          </div>

          {/* Diary Bottom */}
          <div className="mt-6 pt-4 border-t-2 border-amber-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-800" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 bg-yellow-50 border border-amber-600 rounded text-sm font-serif focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            
            {lastSaved && (
              <p className="text-xs text-amber-800 font-serif">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-lg shadow p-5 border border-amber-200">
          <p className="text-sm text-gray-700 font-serif">
            <strong>💡 Tip:</strong> Write naturally as you would in a real diary. Use the lined paper to organize your thoughts. Navigate between dates using the arrows or date picker.
          </p>
        </div>
      </div>

      {/* Google Font for handwriting effect */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap');
        .font-handwriting {
          font-family: 'Kalam', cursive;
        }
      `}</style>
    </div>
  )
}