import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { supabase } from '../services/supabaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            // Auth state change will be picked up by App.jsx listener
        } catch (err) {
            setError(err.message)
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-sky-600 rounded-xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-sky-600/20">
                            <span className="text-2xl font-bold">NovaSync</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-slate-500">
                            Please enter your details to access your dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email / Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer" />
                                <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-sky-600 hover:text-sky-700 hover:underline transition-all">
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2 animate-shake">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-slate-900/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don't have an account?{' '}
                        <a href="#" className="font-medium text-sky-600 hover:text-sky-700 hover:underline transition-all">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
