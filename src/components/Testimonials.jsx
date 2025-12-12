import './Testimonials.css'

function Testimonials() {
    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'CEO, TechFlow',
            avatar: '👩‍💼',
            rating: 5,
            text: 'This platform transformed how we make decisions. The real-time insights are game-changing.'
        },
        {
            name: 'Michael Rodriguez',
            role: 'VP of Operations, GlobalCorp',
            avatar: '👨‍💼',
            rating: 5,
            text: 'Best investment we made this year. ROI was visible within the first month.'
        },
        {
            name: 'Emily Watson',
            role: 'Data Director, Innovate Inc',
            avatar: '👩‍💻',
            rating: 5,
            text: 'Incredibly intuitive and powerful. Our team was up and running in days, not weeks.'
        }
    ]

    return (
        <section className="testimonials">
            <div className="container">
                <div className="testimonials-header">
                    <h2 className="section-title">
                        Loved by teams
                        <span className="gradient-text"> everywhere</span>
                    </h2>
                    <p className="section-description">
                        See what our customers have to say about their experience
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card glass-card">
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="star">⭐</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.avatar}</div>
                                <div className="author-info">
                                    <div className="author-name">{testimonial.name}</div>
                                    <div className="author-role">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
