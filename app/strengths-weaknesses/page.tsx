'use client'

import React, { useState, useEffect } from 'react'
import { Save, RotateCcw, Home, Calendar, ChevronLeft, ChevronRight, Eraser, Pen } from 'lucide-react'

interface DiaryEntry {
  id: string
  date: string
  strengthsText: string
  weaknessesText: string
  strengthsDrawing?: string
  weaknessesDrawing?: string
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
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
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
  const [inputMode, setInputMode] = useState<'type' | 'draw'>('type')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState<'pen' | 'eraser'>('pen')

  const strengthsCanvasRef = React.useRef<HTMLCanvasElement>(null)
  const weaknessesCanvasRef = React.useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (entries.length === 0) {
      setEntries([{
        id: Date.now().toString(),
        date: selectedDate,
        strengthsText: '',
        weaknessesText: '',
        strengthsDrawing: '',
        weaknessesDrawing: ''
      }])
    }
  }, [])

  useEffect(() => {
    if (inputMode === 'draw') {
      loadDrawings()
    }
  }, [selectedDate, inputMode])

  useEffect(() => {
    if (inputMode === 'draw') {
      initializeCanvas(strengthsCanvasRef.current)
      initializeCanvas(weaknessesCanvasRef.current)
      loadDrawings()
    }
  }, [selectedDate, inputMode])

  useEffect(() => {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // initialize today's entry if nothing saved
      setEntries([{
        id: Date.now().toString(),
        date: selectedDate,
        strengthsText: '',
        weaknessesText: '',
        strengthsDrawing: '',
        weaknessesDrawing: ''
      }]);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    setLastSaved(new Date()); // update last saved timestamp
  }, [entries]);


  const initializeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#1f2937'
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
  }

  const loadDrawings = () => {
    const entry = entries.find(e => e.date === selectedDate)

    if (strengthsCanvasRef.current) {
      const canvas = strengthsCanvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (entry?.strengthsDrawing) {
          const img = new Image()
          img.onload = () => {
            ctx.save()
            ctx.scale(dpr, dpr)
            ctx.drawImage(img, 0, 0, rect.width, rect.height)
            ctx.restore()
          }
          img.src = entry.strengthsDrawing
        }
      }
    }

    if (weaknessesCanvasRef.current) {
      const canvas = weaknessesCanvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (entry?.weaknessesDrawing) {
          const img = new Image()
          img.onload = () => {
            ctx.save()
            ctx.scale(dpr, dpr)
            ctx.drawImage(img, 0, 0, rect.width, rect.height)
            ctx.restore()
          }
          img.src = entry.weaknessesDrawing
        }
      }
    }
  }

  const getCurrentEntry = (): DiaryEntry => {
    const entry = entries.find(e => e.date === selectedDate)
    if (entry) return entry

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      strengthsText: '',
      weaknessesText: '',
      strengthsDrawing: '',
      weaknessesDrawing: ''
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

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    return { x, y }
  }
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (drawMode === 'pen') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = 2       // smaller pen
      ctx.strokeStyle = '#003366'
      ctx.shadowBlur = 0.5      // smoother stroke
      ctx.shadowColor = '#003366'
    } else {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 20
      ctx.shadowBlur = 0
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const { x, y } = getCanvasCoordinates(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
      ; (ctx as any).lastX = x
      ; (ctx as any).lastY = y
  }

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    if (!isDrawing) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCanvasCoordinates(e, canvas)

    if ((ctx as any).lastX !== undefined && (ctx as any).lastY !== undefined) {
      ctx.beginPath()
      ctx.moveTo((ctx as any).lastX, (ctx as any).lastY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    ; (ctx as any).lastX = x
      ; (ctx as any).lastY = y
  }

  const stopDrawing = (canvas: HTMLCanvasElement, type: 'strengths' | 'weaknesses') => {
    if (!isDrawing) return
    setIsDrawing(false)

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ; (ctx as any).lastX = undefined
        ; (ctx as any).lastY = undefined
    }

    const dataUrl = canvas.toDataURL()
    setEntries(prev =>
      prev.map(entry =>
        entry.date === selectedDate
          ? { ...entry, [type === 'strengths' ? 'strengthsDrawing' : 'weaknessesDrawing']: dataUrl }
          : entry
      )
    )
  }

  const clearDrawing = (canvas: HTMLCanvasElement | null, type: 'strengths' | 'weaknesses') => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    initializeCanvas(canvas)

    setEntries(prev => prev.map(entry =>
      entry.date === selectedDate
        ? { ...entry, [type === 'strengths' ? 'strengthsDrawing' : 'weaknessesDrawing']: '' }
        : entry
    ))
  }

  const saveData = () => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    setLastSaved(new Date());
    alert('Diary saved successfully!');
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all diary entries?')) {
      setEntries([{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        strengthsText: '',
        weaknessesText: '',
        strengthsDrawing: '',
        weaknessesDrawing: ''
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
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>

          <div className="flex gap-2">
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

          {/* Input Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg border-2 border-amber-700 overflow-hidden">
              <button
                onClick={() => setInputMode('type')}
                className={`px-6 py-2 font-medium transition-colors ${inputMode === 'type'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
              >
                ⌨️ Type
              </button>
              <button
                onClick={() => setInputMode('draw')}
                className={`px-6 py-2 font-medium transition-colors ${inputMode === 'draw'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
              >
                ✍️ Draw
              </button>
            </div>
          </div>

          {/* Pen/Eraser Toggle (only visible in draw mode) */}
          {inputMode === 'draw' && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border-2 border-blue-600 overflow-hidden">
                <button
                  onClick={() => setDrawMode('pen')}
                  className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${drawMode === 'pen'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-900 hover:bg-blue-50'
                    }`}
                >
                  <Pen className="w-4 h-4" />
                  Pen
                </button>
                <button
                  onClick={() => setDrawMode('eraser')}
                  className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${drawMode === 'eraser'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-900 hover:bg-blue-50'
                    }`}
                >
                  <Eraser className="w-4 h-4" />
                  Eraser
                </button>
              </div>
            </div>
          )}

          {/* Diary Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Page - Strengths */}
            <div className="relative">
              <div className="bg-yellow-50 rounded shadow-lg p-6 min-h-[500px]" style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5b7 31px, #e5d5b7 32px)`,
                lineHeight: '32px'
              }}>
                <div className="mb-4 pb-2 border-b border-green-600 flex justify-between items-center">
                  <h2 className="text-green-700 font-bold text-xl font-serif">
                    ✓ What I Accomplished
                  </h2>
                  {inputMode === 'draw' && (
                    <button
                      onClick={() => clearDrawing(strengthsCanvasRef.current, 'strengths')}
                      className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                {inputMode === 'type' ? (
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
                ) : (
                  <canvas
                    ref={strengthsCanvasRef}
                    className="w-full h-[400px] touch-none bg-transparent"
                    style={{
                      width: '100%',
                      height: '400px',
                      cursor: drawMode === 'pen'
                        ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iIzAwMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xNi44NjIgNC40ODcgMS42ODctMS42ODhhMS44NzUgMS44NzUgMCAxIDEgMi42NTIgMi42NTJMNS44MzIgMTkuODJhNC41IDQuNSAwIDAgMS0xLjg5NyAxLjEzbC0yLjY4NS44LjgtMi42ODVhNC41IDQuNSAwIDAgMSAxLjEzLTEuODk3TDE2Ljg2MyA0LjQ4N1ptMCAwTDE5LjUgNy4xMjUiIC8+PC9zdmc+") 0 24, auto'
                        : 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMjFIOGEyIDIgMCAwIDEtMS40Mi0uNTg3bC0zLjk5NC0zLjk5OWEyIDIgMCAwIDEgMC0yLjgyOGwxMC0xMGEyIDIgMCAwIDEgMi44MjkgMGw1Ljk5OSA2YTIgMiAwIDAgMSAwIDIuODI4TDEyLjgzNCAyMSIvPjxwYXRoIGQ9Im01LjA4MiAxMS4wOSA4LjgyOCA4LjgyOCIvPjwvc3ZnPg==") 12 12, auto'
                    }}
                    onMouseDown={(e) => startDrawing(e, strengthsCanvasRef.current!)}
                    onMouseMove={(e) => draw(e, strengthsCanvasRef.current!)}
                    onMouseUp={() => stopDrawing(strengthsCanvasRef.current!, 'strengths')}
                    onMouseLeave={() => stopDrawing(strengthsCanvasRef.current!, 'strengths')}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      startDrawing(e, strengthsCanvasRef.current!)
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault()
                      draw(e, strengthsCanvasRef.current!)
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      stopDrawing(strengthsCanvasRef.current!, 'strengths')
                    }}
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-100 transform rotate-45 translate-x-8 translate-y-8 shadow-xl"></div>
            </div>

            {/* Right Page - Weaknesses */}
            <div className="relative">
              <div className="bg-yellow-50 rounded shadow-lg p-6 min-h-[500px]" style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5b7 31px, #e5d5b7 32px)`,
                lineHeight: '32px'
              }}>
                <div className="mb-4 pb-2 border-b border-red-600 flex justify-between items-center">
                  <h2 className="text-red-700 font-bold text-xl font-serif">
                    ✗ What I Couldn't Achieve
                  </h2>
                  {inputMode === 'draw' && (
                    <button
                      onClick={() => clearDrawing(weaknessesCanvasRef.current, 'weaknesses')}
                      className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                {inputMode === 'type' ? (
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
                ) : (
                  <canvas
                    ref={weaknessesCanvasRef}
                    className="w-full h-[400px] touch-none bg-transparent"
                    style={{
                      width: '100%',
                      height: '400px',
                      cursor: drawMode === 'pen'
                        ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iIzAwMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xNi44NjIgNC40ODcgMS42ODctMS42ODhhMS44NzUgMS44NzUgMCAxIDEgMi42NTIgMi42NTJMNS44MzIgMTkuODJhNC41IDQuNSAwIDAgMS0xLjg5NyAxLjEzbC0yLjY4NS44LjgtMi42ODVhNC41IDQuNSAwIDAgMSAxLjEzLTEuODk3TDE2Ljg2MyA0LjQ4N1ptMCAwTDE5LjUgNy4xMjUiIC8+PC9zdmc+") 0 24, auto'
                        : 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMjFIOGEyIDIgMCAwIDEtMS40Mi0uNTg3bC0zLjk5NC0zLjk5OWEyIDIgMCAwIDEgMC0yLjgyOGwxMC0xMGEyIDIgMCAwIDEgMi44MjkgMGw1Ljk5OSA2YTIgMiAwIDAgMSAwIDIuODI4TDEyLjgzNCAyMSIvPjxwYXRoIGQ9Im01LjA4MiAxMS4wOSA4LjgyOCA4LjgyOCIvPjwvc3ZnPg==") 12 12, auto'
                    }}
                    onMouseDown={(e) => startDrawing(e, weaknessesCanvasRef.current!)}
                    onMouseMove={(e) => draw(e, weaknessesCanvasRef.current!)}
                    onMouseUp={() => stopDrawing(weaknessesCanvasRef.current!, 'weaknesses')}
                    onMouseLeave={() => stopDrawing(weaknessesCanvasRef.current!, 'weaknesses')}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      startDrawing(e, weaknessesCanvasRef.current!)
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault()
                      draw(e, weaknessesCanvasRef.current!)
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      stopDrawing(weaknessesCanvasRef.current!, 'weaknesses')
                    }}
                  />
                )}
              </div>
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
            <strong>💡 Tip:</strong> {inputMode === 'type'
              ? 'Write naturally as you would in a real diary. Use the lined paper to organize your thoughts.'
              : drawMode === 'pen'
                ? 'Use your finger, stylus, or pen to write on the canvas. Switch to eraser mode to remove mistakes.'
                : 'Use the eraser to remove parts of your drawing. Switch back to pen mode to continue writing.'
            } Navigate between dates using the arrows or date picker.
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