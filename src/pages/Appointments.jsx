import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, User, Phone, MoreVertical, RefreshCw, List, ChevronLeft, ChevronRight, Grid } from 'lucide-react'
import { fetchAppointments, formatAppointment } from '../services/googleCalendarService'

export default function Appointments() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [viewMode, setViewMode] = useState('month') // 'month' | 'week' | 'day'
    const [currentDate, setCurrentDate] = useState(new Date())

    // Mock Providers for the sidebar
    const providers = [
        { id: 1, name: 'Dr. Vora', role: 'Lead Dentist', color: 'blue' },
        { id: 2, name: 'Dr. Smith', role: 'Orthodontist', color: 'purple' },
        { id: 3, name: 'Dr. Sarah', role: 'Hygienist', color: 'green' }
    ]

    useEffect(() => {
        loadAppointments()
    }, [])

    const loadAppointments = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchAppointments()
            const formatted = data.map(formatAppointment)
            setAppointments(formatted)
        } catch (err) {
            console.error('Failed to load appointments:', err)
            setError('Failed to load appointments from Google Calendar')
        } finally {
            setLoading(false)
        }
    }

    // --- Calendar Logic ---
    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

    const navigateDate = (direction) => {
        const newDate = new Date(currentDate)
        if (viewMode === 'month') {
            newDate.setMonth(currentDate.getMonth() + direction)
        } else if (viewMode === 'week') {
            newDate.setDate(currentDate.getDate() + (direction * 7))
        } else {
            newDate.setDate(currentDate.getDate() + direction)
        }
        setCurrentDate(newDate)
    }

    const getAppointmentsForDate = (date) => {
        return appointments.filter(apt => {
            const aptDate = new Date(apt.date)
            return aptDate.getDate() === date.getDate() &&
                aptDate.getMonth() === date.getMonth() &&
                aptDate.getFullYear() === date.getFullYear()
        })
    }

    // --- Render Views ---
    const renderMonthView = () => {
        const days = []
        const totalDays = daysInMonth(currentDate)
        const startDay = firstDayOfMonth(currentDate)

        // Empty cells
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-gray-50 h-32 border-b border-r border-gray-100"></div>)
        }

        // Days
        for (let day = 1; day <= totalDays; day++) {
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            const dayApts = getAppointmentsForDate(dayDate)
            const isToday = new Date().toDateString() === dayDate.toDateString()
            const isSelected = currentDate.toDateString() === dayDate.toDateString()

            days.push(
                <div
                    key={day}
                    onClick={() => setCurrentDate(dayDate)}
                    className={`bg-white h-32 border-b border-r border-gray-100 p-2 overflow-y-auto hover:bg-gray-50 transition-colors cursor-pointer 
                    ${isSelected ? 'bg-blue-50' : ''}
                `}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                            {day}
                        </span>
                        {dayApts.length > 0 && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{dayApts.length}</span>}
                    </div>
                    <div className="space-y-1">
                        {dayApts.slice(0, 3).map((apt) => (
                            <div key={apt.id} className="text-xs p-1 rounded bg-sky-100 text-sky-800 truncate border border-sky-200">
                                {apt.time} {apt.patient}
                            </div>
                        ))}
                        {dayApts.length > 3 && <div className="text-xs text-center text-gray-500">+{dayApts.length - 3} more</div>}
                    </div>
                </div>
            )
        }
        return <div className="grid grid-cols-7 border-t border-l border-gray-200 shadow-sm rounded-lg overflow-hidden">{days}</div>
    }

    const renderWeekView = () => {
        // Get start of week (Sunday)
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

        const weekDays = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            weekDays.push(day)
        }

        return (
            <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 divide-x divide-gray-200">
                    {weekDays.map(day => (
                        <div key={day.toString()} className={`p-3 text-center ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}`}>
                            <div className="text-xs font-semibold text-gray-500 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className={`text-lg font-bold ${day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-900'}`}>
                                {day.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Body (Simple List for now, ideal would be time grid) */}
                <div className="grid grid-cols-7 bg-white divide-x divide-gray-200 h-96 overflow-y-auto">
                    {weekDays.map(day => {
                        const apts = getAppointmentsForDate(day)
                        return (
                            <div key={day.toString()} className="p-2 space-y-2" onClick={() => setCurrentDate(day)}>
                                {apts.map(apt => (
                                    <div key={apt.id} className="p-2 text-xs bg-sky-50 text-sky-700 rounded border border-sky-100">
                                        <div className="font-bold">{apt.time}</div>
                                        <div>{apt.patient}</div>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const renderDayView = () => {
        const apts = getAppointmentsForDate(currentDate)
        const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM

        return (
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-center">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex-1 overflow-y-auto">
                    {hours.map(hour => {
                        const displayTime = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`
                        // Filter apts for this hour loosely (basic string matching for demo)
                        const hourApts = apts.filter(a => a.time.startsWith(hour < 10 ? `0${hour}` : `${hour}`) ||
                            (hour > 12 && a.time.startsWith(hour - 12 < 10 ? `0${hour - 12}` : `${hour - 12}`))
                        )

                        return (
                            <div key={hour} className="flex border-b border-gray-100 min-h-[60px]">
                                <div className="w-20 p-2 text-xs text-gray-500 text-right border-r border-gray-100 font-medium pt-3">
                                    {displayTime}
                                </div>
                                <div className="flex-1 p-1 bg-gray-50/30">
                                    {hourApts.map(apt => (
                                        <div key={apt.id} className="bg-sky-100 border border-sky-200 text-sky-800 text-xs p-1 px-2 rounded mb-1">
                                            {apt.time} - {apt.patient} ({apt.treatment})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // --- Right Sidebar: Provider Schedule ---
    const renderProviderSidebar = () => {
        // In a real app, we'd filter by provider ID. 
        // For now, let's just distribute current day's appointments mockingly
        const dayApts = getAppointmentsForDate(currentDate)

        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col sticky top-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Provider Schedule</h3>
                    <p className="text-xs text-gray-500">{currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {providers.map(provider => (
                        <div key={provider.id}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-8 h-8 rounded-full bg-${provider.color}-100 flex items-center justify-center text-${provider.color}-600 font-bold text-xs`}>
                                    {provider.name.charAt(0)}{provider.name.split(' ')[1].charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                                    <div className="text-xs text-gray-500">{provider.role}</div>
                                </div>
                            </div>

                            {/* Mock Data Distribution */}
                            <div className="space-y-2 pl-4 border-l-2 border-gray-100 ml-4">
                                {provider.id === 1 && dayApts.length > 0 ? (
                                    dayApts.map(apt => (
                                        <div key={apt.id} className="bg-gray-50 p-2 rounded text-xs border border-gray-100 hover:border-blue-300 transition-colors cursor-pointer">
                                            <div className="font-semibold text-gray-700">{apt.time}</div>
                                            <div className="text-gray-900">{apt.patient}</div>
                                            <div className="text-gray-500 italic lowercase">{apt.treatment}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-gray-400 italic py-2">No appointments scheduled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex gap-6 h-full">
            {/* Main Content (Left) */}
            <div className="flex-1 space-y-6 min-w-0">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                        <h2 className="text-xl font-bold text-gray-900 w-48 text-center">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={20} /></button>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['day', 'week', 'month'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${viewMode === mode ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={loadAppointments} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><RefreshCw size={20} className={loading && 'animate-spin'} /></button>
                        <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">Book New</button>
                    </div>
                </div>

                {/* Calendar Views */}
                {loading ? (
                    <div className="flex items-center justify-center h-96 bg-white rounded-xl border border-gray-200">
                        <RefreshCw className="animate-spin text-sky-500" size={32} />
                    </div>
                ) : (
                    <>
                        {viewMode === 'month' && renderMonthView()}
                        {viewMode === 'week' && renderWeekView()}
                        {viewMode === 'day' && renderDayView()}
                    </>
                )}
            </div>

            {/* Sidebar (Right) - Daily Provider View */}
            <div className="w-80 flex-shrink-0">
                {renderProviderSidebar()}
            </div>
        </div>
    )
}
