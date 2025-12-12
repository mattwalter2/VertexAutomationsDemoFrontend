import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-badge animate-fade-in-up">
                        <span className="badge-dot"></span>
                        <span>Trusted by 10,000+ businesses worldwide</span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up stagger-1">
                        Transform Your Business
                        <br />
                        <span className="gradient-text">With Data-Driven Insights</span>
                    </h1>

                    <p className="hero-description animate-fade-in-up stagger-2">
                        Unlock the power of real-time analytics, automated reporting, and intelligent forecasting.
                        Make smarter decisions faster with our all-in-one business intelligence platform.
                    </p>

                    <div className="hero-cta animate-fade-in-up stagger-3">
                        <button className="btn btn-primary">
                            Start Free Trial
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="btn btn-secondary">
                            Watch Demo
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M8 5L14 10L8 15V5Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>

                    <div className="hero-stats animate-fade-in-up stagger-4">
                        <div className="stat-item">
                            <div className="stat-value">99.9%</div>
                            <div className="stat-label">Uptime</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">50M+</div>
                            <div className="stat-label">Data Points</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">24/7</div>
                            <div className="stat-label">Support</div>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="dashboard-preview glass-card animate-fade-in-up stagger-2">
                        <div className="preview-header">
                            <div className="preview-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="preview-title">Analytics Dashboard</div>
                        </div>
                        <div className="preview-content">
                            <div className="chart-placeholder animate-float">
                                <div className="chart-bar" style={{ height: '60%' }}></div>
                                <div className="chart-bar" style={{ height: '80%' }}></div>
                                <div className="chart-bar" style={{ height: '45%' }}></div>
                                <div className="chart-bar" style={{ height: '90%' }}></div>
                                <div className="chart-bar" style={{ height: '70%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="floating-card glass-card animate-float" style={{ animationDelay: '1s' }}>
                        <div className="card-icon">📈</div>
                        <div className="card-text">
                            <div className="card-label">Revenue Growth</div>
                            <div className="card-value">+32.5%</div>
                        </div>
                    </div>

                    <div className="floating-card glass-card animate-float" style={{ animationDelay: '2s' }}>
                        <div className="card-icon">👥</div>
                        <div className="card-text">
                            <div className="card-label">Active Users</div>
                            <div className="card-value">12,458</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
