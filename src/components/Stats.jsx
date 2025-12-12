import './Stats.css'

function Stats() {
    const stats = [
        { value: '10,000+', label: 'Active Customers', growth: '+23%' },
        { value: '$2.4B', label: 'Processed Revenue', growth: '+156%' },
        { value: '99.99%', label: 'Platform Uptime', growth: 'Industry Leading' },
        { value: '150+', label: 'Countries Served', growth: '+45%' }
    ]

    return (
        <section className="stats">
            <div className="container">
                <div className="stats-content">
                    <div className="stats-text">
                        <h2 className="stats-title">
                            Trusted by industry leaders
                            <span className="gradient-text"> worldwide</span>
                        </h2>
                        <p className="stats-description">
                            Join thousands of companies using our platform to drive growth,
                            improve efficiency, and make data-driven decisions.
                        </p>
                        <button className="btn btn-primary">
                            See Customer Stories
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card glass-card">
                                <div className="stat-card-value">{stat.value}</div>
                                <div className="stat-card-label">{stat.label}</div>
                                <div className="stat-card-growth">
                                    <span className="growth-indicator">↗</span>
                                    {stat.growth}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Stats
