import React from 'react';
import { X, Clock, Calendar, DollarSign, Activity, FileText, MessageSquare } from 'lucide-react';

export default function CallDetailsModal({ call, onClose }) {
    if (!call) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="text-sky-600" size={20} />
                            Call Details
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">ID: {call.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">

                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <Calendar size={16} /> Date
                            </div>
                            <div className="font-semibold text-slate-800">{call.date}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <Clock size={16} /> Time
                            </div>
                            <div className="font-semibold text-slate-800">{call.time}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <Clock size={16} /> Duration
                            </div>
                            <div className="font-semibold text-slate-800">{call.duration}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <DollarSign size={16} /> Cost
                            </div>
                            <div className="font-semibold text-slate-800">
                                ${call.cost ? call.cost.toFixed(2) : '0.00'}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Summary Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                <FileText className="text-indigo-600" size={20} />
                                <h3>Call Summary</h3>
                            </div>
                            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 text-slate-700 leading-relaxed text-sm md:text-base">
                                {call.summary || "No summary available for this call."}
                            </div>

                            {call.recordingUrl && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Recording</h4>
                                    <audio controls className="w-full h-10 rounded-lg">
                                        <source src={call.recordingUrl} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                        </div>

                        {/* Transcript Section */}
                        <div className="space-y-4 flex flex-col h-full max-h-[500px]">
                            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                <MessageSquare className="text-emerald-600" size={20} />
                                <h3>Transcript</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                                {call.messages && call.messages.length > 0 ? (
                                    call.messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                                                }`}>
                                                <p className="font-medium text-xs opacity-70 mb-1 capitalize">{msg.role}</p>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm whitespace-pre-wrap">
                                        {call.fullTranscript || call.transcript || "No transcript data."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
