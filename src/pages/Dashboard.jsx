import { useState, useEffect } from 'react'
import { Calendar, Users, Phone, TrendingUp, Clock, CheckCircle2, AlertCircle, RefreshCw, Loader2, ArrowRight, Activity } from 'lucide-react'
import { fetchCalls, getCallStats, getVapi } from '../services/vapiService'
import { fetchLeadsFromSheets } from '../services/googleSheetsService'
import { fetchAppointments, formatAppointment } from '../services/googleCalendarService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function Dashboard({ onNavigate }) {
    const [stats, setStats] = useState({
        appointments: 0,
        leads: 0,
        calls: 0,
        conversionRate: 0
    })
    const [recentCalls, setRecentCalls] = useState([])
    const [recentAppointments, setRecentAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [isCalling, setIsCalling] = useState(false)
    const [activeCall, setActiveCall] = useState(null)

    useEffect(() => {
        loadDashboardData()
    }, [])

    // Listen to Vapi events (Commented out to avoid invalid Public Key error)
    // useEffect(() => {
    //     const vapi = getVapi();
    //     if (vapi) {
    //         vapi.on('call-start', () => {
    //             setIsCalling(false);
    //             setActiveCall('in-progress');
    //         });
    //         vapi.on('call-end', () => {
    //             setActiveCall(null);
    //         });
    //         vapi.on('error', (e) => {
    //             console.error("Vapi Error:", e);
    //             setIsCalling(false);
    //             setActiveCall(null);
    //         });
    //     }
    // }, []);

    const loadDashboardData = async () => {
        setLoading(true)
        try {
            const callsData = await fetchCalls(10)
            const callStats = getCallStats(callsData)

            const leadsData = await fetchLeadsFromSheets()
            const aptsData = await fetchAppointments()

            const formattedApts = aptsData.slice(0, 3).map(formatAppointment)
            setRecentAppointments(formattedApts)

            const formattedCalls = callsData.slice(0, 3).map(call => ({
                name: call.customer?.name || 'Unknown',
                time: getTimeAgo(new Date(call.createdAt)),
                duration: formatDuration(call),
                outcome: call.endedReason === 'assistant-ended-call' ? 'Completed' :
                    call.status === 'ended' ? 'Ended' : 'In Progress',
                language: call.assistant?.voice?.language || 'English'
            }))

            setRecentCalls(formattedCalls)

            const conversionRate = callStats.totalCalls > 0
                ? Math.round((callStats.completedCalls / callStats.totalCalls) * 100)
                : 0

            setStats({
                appointments: aptsData.length,
                leads: leadsData.length, // leadsData is now the array from API
                calls: callStats.totalCalls,
                conversionRate
            })
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (call) => {
        if (!call.startedAt || !call.endedAt) return 'N/A'
        const duration = new Date(call.endedAt) - new Date(call.startedAt)
        const minutes = Math.floor(duration / 60000)
        const seconds = Math.floor((duration % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 60) return `${seconds}s ago`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    const handleTestCall = async () => {
        if (isCalling) {
            // Can't stop a phone call from here easily without ID, but UI reset
            setIsCalling(false);
            return;
        }
        try {
            setIsCalling(true);
            const phoneNumber = '+17032680110'; // User provided number

            console.log("Requesting phone call to:", phoneNumber);

            const response = await fetch('https://nourdemodashboardbackend.onrender.com/api/vapi/initiate-call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    name: 'Matthew',
                    procedure_interest: 'Invisalign'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details || 'Failed to initiate call');
            }

            console.log("Call initiated successfully:", data);
            alert(`Call initiated! Your phone (${phoneNumber}) should ring shortly.`);

            // Reset button state after a delay since we can't track live status easily here yet
            setTimeout(() => setIsCalling(false), 5000);

        } catch (err) {
            console.error("Failed to start phone call:", err);
            setIsCalling(false);
            alert(`Failed to start call: ${err.message}. Ensure python server is running.`);
        }
    }

    const statsConfig = [
        {
            label: "Today's Appointments",
            value: stats.appointments,
            icon: Calendar,
            color: 'blue',
            desc: 'Scheduled in Calendar'
        },
        {
            label: 'New Leads',
            value: stats.leads,
            icon: Users,
            color: 'indigo',
            desc: 'From Google Forms'
        },
        {
            label: 'Total Calls',
            value: stats.calls,
            icon: Phone,
            color: 'emerald',
            desc: 'Processed by AI'
        },
        {
            label: 'Engagement Rate',
            value: `${stats.conversionRate}%`,
            icon: Activity,
            color: 'violet',
            desc: 'Call Success Metric'
        },
    ]

    // Helper for gradient styles
    const getGradient = (color) => {
        const map = {
            blue: 'from-blue-500 to-blue-600',
            indigo: 'from-indigo-500 to-indigo-600',
            emerald: 'from-emerald-500 to-emerald-600',
            violet: 'from-violet-500 to-purple-600',
        }
        return map[color] || map.blue
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Operational • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={loadDashboardData}
                    disabled={loading}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium border border-gray-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin text-blue-600' : 'text-gray-500'} />
                    <span className="hidden sm:inline">Refresh Data</span>
                </button>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <div key={idx} className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <Icon size={80} className={`text-${stat.color}-600`} />
                            </div>
                            <div className="relative z-10">
                                <div className={`inline-flex p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 mb-4`}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
                                <p className="text-xs text-gray-400 mt-2">{stat.desc}</p>
                            </div>
                            {/* Bottom Accent Line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(stat.color)} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                    )
                })}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Appointments Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Calendar size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                        </div>
                        <button onClick={() => onNavigate('appointments')} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 group">
                            View Calendar <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 min-h-[300px]">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 size={32} className="animate-spin mb-2 text-blue-500" />
                                <span className="text-sm">Syncing calendar...</span>
                            </div>
                        ) : recentAppointments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100 py-10">
                                <Calendar size={48} className="text-gray-200 mb-4" />
                                <p className="text-gray-500 font-medium">No appointments scheduled</p>
                                <p className="text-xs text-gray-400 mt-1">Check back later or book a new slot</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentAppointments.map((apt, index) => (
                                    <div key={index} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm hover:bg-white transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-lg border border-gray-200 shadow-sm group-hover:border-blue-100 transition-colors">
                                                <span className="text-xs font-bold text-gray-400 uppercase">{apt.time.split(' ')[1]}</span>
                                                <span className="text-sm font-bold text-gray-900">{apt.time.split(' ')[0]}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{apt.patient}</h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                    {apt.treatment}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${apt.status === 'confirmed'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Calls Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <Phone size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Recent AI Calls</h2>
                        </div>
                        <button onClick={() => onNavigate('calls')} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 group">
                            All Activity <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 min-h-[300px]">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 size={32} className="animate-spin mb-2 text-emerald-500" />
                                <span className="text-sm">Fetching call logs...</span>
                            </div>
                        ) : recentCalls.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100 py-10">
                                <Phone size={48} className="text-gray-200 mb-4" />
                                <p className="text-gray-500 font-medium">No recent calls</p>
                                <p className="text-xs text-gray-400 mt-1">AI voice agent is ready</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentCalls.map((call, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm hover:bg-white transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                                                {call.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{call.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                    <Clock size={12} />
                                                    <span>{call.time}</span>
                                                    <span>•</span>
                                                    <span>{call.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${call.outcome === 'Completed' || call.outcome === 'Booked'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                {call.outcome}
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{call.language}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Quick Actions */}
            {/* Hero Quick Actions */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-primary text-white shadow-xl">
                <div className="relative z-10 p-8 md:p-10">
                    <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
                    <p className="text-slate-400 mb-8 max-w-lg">Instantly launch key workflows. Your AI assistant is ready to handle calls or manage your schedule.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Book Appointment */}
                        <button
                            onClick={() => onNavigate('appointments')}
                            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm rounded-xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-4 w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Book Schedule</h3>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300">Add new appointment</p>
                        </button>

                        {/* Test Call - Special Style */}
                        <button
                            onClick={handleTestCall}
                            className={`group relative overflow-hidden backdrop-blur-sm rounded-xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg border ${activeCall
                                ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40'
                                }`}
                        >
                            <div className={`mb-4 w-12 h-12 rounded-lg flex items-center justify-center transition-all ${activeCall
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                                }`}>
                                {isCalling ? <Loader2 size={24} className="animate-spin" /> : <Phone size={24} />}
                            </div>
                            <h3 className={`text-lg font-bold mb-1 ${activeCall ? 'text-red-400' : 'text-emerald-400'}`}>
                                {isCalling ? 'Connecting...' : activeCall ? 'End Session' : 'Test AI Agent'}
                            </h3>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300">{activeCall ? 'Click to hang up' : 'Start interactive demo'}</p>
                        </button>

                        {/* Add Lead */}
                        <button
                            onClick={() => onNavigate('leads')}
                            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm rounded-xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-4 w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Add Lead</h3>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300">Record new patient</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
