import './Features.css'

function Features() {
    const features = [
        {
            icon: '📊',
            title: 'Real-Time Analytics',
            description: 'Monitor your business metrics in real-time with customizable dashboards and instant alerts.'
        },
        {
            icon: '🤖',
            title: 'AI-Powered Insights',
            description: 'Leverage machine learning to uncover trends, predict outcomes, and automate decisions.'
        },
        {
            icon: '🔒',
            title: 'Enterprise Security',
            description: 'Bank-level encryption, SOC 2 compliance, and granular access controls keep your data safe.'
        },
        {
            icon: '🔗',
            title: 'Seamless Integrations',
            description: 'Connect with 100+ tools including Salesforce, Slack, Google Workspace, and more.'
        },
        {
            icon: '📱',
            title: 'Mobile First',
            description: 'Access your dashboard anywhere with our native iOS and Android apps.'
        },
        {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Sub-second query times on billions of data points with our optimized infrastructure.'
        }
    ]

    return (
        <section className="features">
            <div className="container">
                <div className="features-header">
                    <h2 className="section-title">
                        Everything you need to
                        <span className="gradient-text"> scale your business</span>
                    </h2>
                    <p className="section-description">
                        Powerful features designed for modern teams. No complexity, just results.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card glass-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
