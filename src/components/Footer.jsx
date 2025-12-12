import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <span className="logo-icon">📊</span>
                            <span className="logo-text">DashBoard</span>
                        </div>
                        <p className="brand-tagline">
                            Empowering businesses with data-driven insights since 2020.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link">𝕏</a>
                            <a href="#" className="social-link">in</a>
                            <a href="#" className="social-link">f</a>
                            <a href="#" className="social-link">📺</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="link-group">
                            <h4 className="link-group-title">Product</h4>
                            <a href="#" className="footer-link">Features</a>
                            <a href="#" className="footer-link">Pricing</a>
                            <a href="#" className="footer-link">Integrations</a>
                            <a href="#" className="footer-link">API</a>
                        </div>

                        <div className="link-group">
                            <h4 className="link-group-title">Company</h4>
                            <a href="#" className="footer-link">About</a>
                            <a href="#" className="footer-link">Blog</a>
                            <a href="#" className="footer-link">Careers</a>
                            <a href="#" className="footer-link">Press</a>
                        </div>

                        <div className="link-group">
                            <h4 className="link-group-title">Resources</h4>
                            <a href="#" className="footer-link">Documentation</a>
                            <a href="#" className="footer-link">Help Center</a>
                            <a href="#" className="footer-link">Community</a>
                            <a href="#" className="footer-link">Contact</a>
                        </div>

                        <div className="link-group">
                            <h4 className="link-group-title">Legal</h4>
                            <a href="#" className="footer-link">Privacy</a>
                            <a href="#" className="footer-link">Terms</a>
                            <a href="#" className="footer-link">Security</a>
                            <a href="#" className="footer-link">Compliance</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">© 2024 DashBoard. All rights reserved.</p>
                    <div className="footer-badges">
                        <span className="badge">🔒 SOC 2 Certified</span>
                        <span className="badge">🛡️ GDPR Compliant</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
