import { useState, useEffect } from 'react'
import { Phone, Clock, CheckCircle2, XCircle, AlertCircle, Play, RefreshCw, Eye } from 'lucide-react'
import { fetchCalls, formatCallData, getCallStats } from '../services/vapiService'
import CallDetailsModal from '../components/CallDetailsModal'

export default function Calls() {
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCall, setSelectedCall] = useState(null)
    const [stats, setStats] = useState({
        totalCalls: 0,
        completedCalls: 0,
        activeCalls: 0,
        successRate: 0
    })

    const loadCalls = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetchCalls(50)
            const formattedCalls = response.map(formatCallData)
            setCalls(formattedCalls)

            // Calculate stats
            const callStats = getCallStats(response)
            setStats(callStats)
        } catch (err) {
            setError(err.message)
            console.error('Failed to load calls:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCalls()
    }, [])

    const getOutcomeColor = (outcome) => {
        if (outcome.includes('Completed') || outcome.includes('Booked')) {
            return 'bg-green-100 text-green-700'
        } else if (outcome.includes('Follow-up') || outcome.includes('Interested')) {
            return 'bg-orange-100 text-orange-700'
        } else if (outcome.includes('Error')) {
            return 'bg-red-100 text-red-700'
        } else {
            return 'bg-gray-100 text-gray-700'
        }
    }

    const getOutcomeIcon = (outcome) => {
        if (outcome.includes('Completed') || outcome.includes('Booked')) {
            return <CheckCircle2 size={20} className="text-green-600" />
        } else if (outcome.includes('Follow-up') || outcome.includes('Interested')) {
            return <AlertCircle size={20} className="text-orange-600" />
        } else {
            return <XCircle size={20} className="text-red-600" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
                    <p className="text-gray-500 mt-1">View and analyze all voice agent calls from Vapi</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadCalls}
                        disabled={loading}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                        <Phone size={20} />
                        Make Test Call
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Calls</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCalls}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completedCalls}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeCalls}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.successRate}%</p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                        <XCircle size={20} />
                        <p className="font-medium">Failed to load calls</p>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <p className="text-xs text-red-500 mt-2">Make sure VITE_VAPI_API_KEY is set in your .env file</p>
                </div>
            )}

            {/* Loading State */}
            {loading && !error && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <RefreshCw size={40} className="animate-spin text-sky-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading calls from Vapi...</p>
                    </div>
                </div>
            )}

            {/* Calls List */}
            {!loading && !error && calls.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <Phone size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No calls yet</h3>
                    <p className="text-gray-600">Make your first test call to see it appear here</p>
                </div>
            )}

            {!loading && !error && calls.length > 0 && (
                <div className="space-y-4">
                    {calls.map((call) => (
                        <div key={call.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                {/* Left Side */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-full ${call.outcome.includes('Completed') ? 'bg-green-100' :
                                            call.outcome.includes('Follow-up') ? 'bg-orange-100' :
                                                'bg-red-100'
                                            }`}>
                                            {getOutcomeIcon(call.outcome)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{call.name}</h3>
                                            <p className="text-sm text-gray-500">{call.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{call.date} at {call.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} />
                                            <span>{call.duration}</span>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                            {call.language}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-gray-500 mb-1">Summary</p>
                                        <p className="text-sm text-gray-700">{call.summary}</p>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="ml-6 flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOutcomeColor(call.outcome)}`}>
                                        {call.outcome}
                                    </span>

                                    <button
                                        onClick={() => setSelectedCall(call)}
                                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        <Eye size={14} />
                                        View Details
                                    </button>

                                    {call.recordingUrl && (
                                        <a
                                            href={call.recordingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium px-3 py-1.5"
                                        >
                                            <Play size={14} />
                                            Play Recording
                                        </a>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">ID: {call.id.substring(0, 8)}...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedCall && (
                <CallDetailsModal
                    call={selectedCall}
                    onClose={() => setSelectedCall(null)}
                />
            )}
        </div>
    )
}
