import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // Simulate API call delay for realism
        setTimeout(() => {
            if (email === 'admin' && password === 'password') {
                onLogin()
            } else {
                setError('Invalid credentials. Try admin / password.')
                setLoading(false)
            }
        }, 1500)
    }

    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900/40 to-slate-900/60 mix-blend-multiply" />
                <img
                    src="/login-bg.png"
                    alt="Medical Technology Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 animate-subtle-zoom"
                />
                <div className="relative z-20 flex flex-col justify-center h-full px-12 text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                            <ShieldCheck className="text-sky-400" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">NovaSync Dental</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300">
                        Intelligent Practice <br /> Management
                    </h1>
                    <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                        Securely manage patient data, appointments, and AI voice agents from a single unified dashboard.
                    </p>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                {/* Mobile Background Decoration */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-6 text-slate-800">
                            <ShieldCheck className="text-sky-600" size={28} />
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
                                    type="text"
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
