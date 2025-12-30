import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, Search, MoreVertical, Send, RefreshCw, ChevronRight, Bell, CalendarClock, Activity, Star, MessageSquare, Mail } from 'lucide-react'
import { fetchFollowUpsFromSheets } from '../services/googleSheetsService'

export default function FollowUps() {
    const [activeTab, setActiveTab] = useState('pending')
    const [followUps, setFollowUps] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFollowUps()
    }, [])

    const loadFollowUps = async () => {
        setLoading(true)
        try {
            const rawData = await fetchFollowUpsFromSheets()

            // Map the data to FollowUp specific format
            const mapped = rawData.map(item => {
                const hasAppointment = item.date && item.time && item.date !== 'N/A';

                // 1. Primary Identifier
                const displayName = item.name || item.phone || "Unknown Patient";

                // 2. Appointment Context
                const context = hasAppointment
                    ? `${item.treatment || 'Appointment'} · ${item.date} at ${item.time}${item.location ? ` (${item.location})` : ''}`
                    : 'New Inquiry · No appointment scheduled';

                // 3. Derived Tags (Based on reminder_stage form backend)
                // 0 -> Pending Appointment Confirmation (Yellow)
                // 1 -> Appointment Reminder (Blue)
                // 2 -> 1hr Appointment Reminder (Red/Urgent)

                const stage = String(item.reminder_stage || '0').trim();
                let statusConfig;

                if (stage === '2') {
                    statusConfig = { label: '1hr Appointment Reminder', color: 'red', icon: AlertCircle };
                } else if (stage === '1') {
                    statusConfig = { label: 'Appointment Reminder', color: 'blue', icon: Bell };
                } else {
                    // Default / 0
                    statusConfig = { label: 'Pending Appt Confirmation', color: 'yellow', icon: Clock };
                }

                return {
                    id: item.id,
                    identifier: displayName,
                    phone: item.phone,
                    context: context,

                    // Chips
                    status: statusConfig,
                    reminderStage: `Stage ${stage}`,

                    // Urgency
                    urgency: stage === '0' ? 'Waiting for confirmation' :
                        stage === '2' ? 'Urgent: Appointment soon' : 'Reminder sent',
                    urgencyColor: stage === '2' ? 'text-red-600 font-bold' :
                        stage === '0' ? 'text-amber-600' : 'text-slate-500',

                    // Last Contact
                    lastContact: item.lastContact || 'Never contacted',

                    // New Fields
                    email: item.email,
                    summary: (item.budget || item.notes)
                        ? `${item.budget ? `Budget: ${item.budget}. ` : ''}${item.notes || ''}`
                        : 'No additional details provided.',

                    raw: item // Keep raw data for actions
                }
            })
            setFollowUps(mapped)
        } catch (error) {
            console.error("Failed to load follow-ups", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Follow-Up System</h1>
                    <p className="text-slate-500 mt-1">Manage patient follow-ups and reminders</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadFollowUps}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">
                        <CalendarClock size={20} />
                        Add Follow-up
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <CalendarClock size={20} className="text-indigo-600" />
                                Active Priority List
                            </h2>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                {['Pending', 'Scheduled'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab.toLowerCase()
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-12 text-center">
                                    <RefreshCw className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-2" />
                                    <p className="text-slate-500">Syncing patient data...</p>
                                </div>
                            ) : followUps.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">All caught up! No active follow-ups.</div>
                            ) : followUps.map((item) => (
                                <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-start justify-between gap-4">

                                        {/* Left Side: Avatar + Info */}
                                        <div className="flex gap-4 flex-1">
                                            {/* Avatar */}
                                            <div className="mt-1 flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
                                                    {item.identifier.charAt(0)}
                                                </div>
                                            </div>

                                            {/* Main Content */}
                                            <div className="min-w-0 flex-1">
                                                {/* 1. Primary Identifier */}
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900 text-base truncate">
                                                        {item.identifier}
                                                    </h3>
                                                    {item.phone && (
                                                        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
                                                            {item.phone}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 2. Context */}
                                                <p className="text-sm text-slate-600 font-medium mt-0.5">
                                                    {item.context}
                                                </p>

                                                {/* Email */}
                                                {item.email && item.email !== 'N/A' && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                                        <Mail size={12} />
                                                        {item.email}
                                                    </div>
                                                )}

                                                {/* Summary */}
                                                <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                                                    <span className="font-semibold text-slate-700 not-italic">Summary: </span>
                                                    {item.summary}
                                                </div>

                                                {/* 3. Status Chips */}
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {/* Confirmation Status */}
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border 
                                                        ${item.status.color === 'yellow' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            item.status.color === 'red' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                        <item.status.icon size={10} />
                                                        {item.status.label}
                                                    </span>

                                                    {/* Reminder Stage */}
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200">
                                                        <Bell size={10} />
                                                        {item.reminderStage}
                                                    </span>
                                                </div>

                                                {/* 4. Urgency & 5. Last Contact */}
                                                <div className="flex items-center gap-4 mt-3 text-xs">
                                                    <span className={`font-medium ${item.urgencyColor}`}>
                                                        {item.urgency}
                                                    </span>
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        Last contact: {item.lastContact}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6. Right Side: Actions */}
                                        <div className="flex flex-col gap-2 items-end">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm hover:shadow active:scale-95 w-32 justify-center">
                                                <Send size={14} />
                                                Send Now
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Analytics Widget */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-emerald-500" />
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Confirmations</span>
                                <span className="font-bold text-slate-800">12 / 20</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full w-[60%]"></div>
                            </div>
                            <p className="text-xs text-slate-400 pt-1">45% higher than last week</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
