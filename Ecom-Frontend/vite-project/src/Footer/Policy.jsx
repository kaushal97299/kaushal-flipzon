import React, { useState, useEffect } from 'react';
import './Policy.css';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');
  const [consentPreferences, setConsentPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem('privacyConsent');
    if (savedConsent) {
      setConsentPreferences(JSON.parse(savedConsent));
    }
  }, []);

  // Save preferences to localStorage
  const saveConsentPreferences = () => {
    localStorage.setItem('privacyConsent', JSON.stringify(consentPreferences));
    alert('Your preferences have been saved successfully.');
  };

  const handleConsentChange = (type) => {
    setConsentPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-header">
        <h1>Privacy Center</h1>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="privacy-layout">
        {/* Navigation Sidebar */}
        <nav className="privacy-nav">
          <h3>Quick Links</h3>
          <ul>
            <li className={activeSection === 'introduction' ? 'active' : ''}>
              <button onClick={() => scrollToSection('introduction')}>Introduction</button>
            </li>
            <li className={activeSection === 'data-collection' ? 'active' : ''}>
              <button onClick={() => scrollToSection('data-collection')}>Data Collection</button>
            </li>
            <li className={activeSection === 'data-usage' ? 'active' : ''}>
              <button onClick={() => scrollToSection('data-usage')}>Data Usage</button>
            </li>
            <li className={activeSection === 'data-sharing' ? 'active' : ''}>
              <button onClick={() => scrollToSection('data-sharing')}>Data Sharing</button>
            </li>
            <li className={activeSection === 'your-rights' ? 'active' : ''}>
              <button onClick={() => scrollToSection('your-rights')}>Your Rights</button>
            </li>
            <li className={activeSection === 'cookie-settings' ? 'active' : ''}>
              <button onClick={() => scrollToSection('cookie-settings')}>Cookie Settings</button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="privacy-content">
          <section id="introduction">
            <h2>1. Introduction</h2>
            <p>
              At [Your Store Name], we prioritize your privacy. This comprehensive policy details our practices 
              regarding personal data collection, usage, and protection in compliance with GDPR, CCPA, and other 
              global privacy regulations..
            </p>
          </section>

          <section id="data-collection">
            <h2>2. Data We Collect</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Purpose</th>
                    <th>Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Identity Data</td>
                    <td>Order processing, account management</td>
                    <td>Contractual necessity</td>
                  </tr>
                  <tr>
                    <td>Contact Data</td>
                    <td>Order updates, customer support</td>
                    <td>Legitimate interest</td>
                  </tr>
                  <tr>
                    <td>Technical Data</td>
                    <td>Website security, analytics</td>
                    <td>Consent (where required)</td>
                  </tr>
                  <tr>
                    <td>Usage Data</td>
                    <td>Improving user experience</td>
                    <td>Legitimate interest</td>
                  </tr>
                  <tr>
                    <td>Marketing Data</td>
                    <td>Personalized offers</td>
                    <td>Consent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="data-usage">
            <h2>3. How We Use Your Data</h2>
            <div className="usage-diagram">
              <div className="usage-item">
                <div className="usage-icon">🛒</div>
                <h4>Order Processing</h4>
                <p>Fulfillment, payments, delivery</p>
              </div>
              <div className="usage-item">
                <div className="usage-icon">🔒</div>
                <h4>Security</h4>
                <p>Fraud prevention, system protection</p>
              </div>
              <div className="usage-item">
                <div className="usage-icon">📈</div>
                <h4>Analytics</h4>
                <p>Website improvement, UX research</p>
              </div>
              <div className="usage-item">
                <div className="usage-icon">✉️</div>
                <h4>Marketing</h4>
                <p>Personalized offers (with consent)</p>
              </div>
            </div>
          </section>

          <section id="data-sharing">
            <h2>4. Data Sharing & International Transfers</h2>
            <p>
              We share data with trusted third parties under strict contractual agreements. When data 
              crosses borders, we implement Standard Contractual Clauses (SCCs) and other safeguards.
            </p>
            <div className="third-parties">
              <h4>Service Providers:</h4>
              <ul>
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Shipping carriers (FedEx, UPS)</li>
                <li>Cloud services (AWS, Google Cloud)</li>
                <li>Marketing platforms (Mailchimp, Klaviyo)</li>
              </ul>
            </div>
          </section>

          <section id="your-rights">
            <h2>5. Your Privacy Rights</h2>
            <div className="rights-grid">
              {[
                { icon: '👁️', name: 'Right to Access', desc: 'Request copies of your data' },
                { icon: '✏️', name: 'Right to Rectify', desc: 'Correct inaccurate information' },
                { icon: '🗑️', name: 'Right to Erasure', desc: 'Request data deletion' },
                { icon: '⏸️', name: 'Right to Restrict', desc: 'Limit data processing' },
                { icon: '📤', name: 'Right to Portability', desc: 'Obtain your data in machine-readable format' },
                { icon: '✋', name: 'Right to Object', desc: 'Opt-out of certain processing' }
              ].map((right, index) => (
                <div className="right-item" key={index}>
                  <div className="right-icon">{right.icon}</div>
                  <h4>{right.name}</h4>
                  <p>{right.desc}</p>
                </div>
              ))}
            </div>
            <button className="data-request-btn">Submit Data Request</button>
          </section>

          <section id="cookie-settings">
            <h2>6. Cookie & Tracking Preferences</h2>
            <div className="consent-manager">
              <div className="consent-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={consentPreferences.necessary} 
                    disabled
                  />
                  <span className="consent-type essential">Essential Cookies</span>
                  <span className="consent-desc">Required for site functionality</span>
                </label>
              </div>
              
              <div className="consent-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={consentPreferences.analytics} 
                    onChange={() => handleConsentChange('analytics')}
                  />
                  <span className="consent-type analytics">Analytics Cookies</span>
                  <span className="consent-desc">Help us improve our website</span>
                </label>
              </div>
              
              <div className="consent-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={consentPreferences.marketing} 
                    onChange={() => handleConsentChange('marketing')}
                  />
                  <span className="consent-type marketing">Marketing Cookies</span>
                  <span className="consent-desc">For personalized advertising</span>
                </label>
              </div>
              
              <div className="consent-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={consentPreferences.personalization} 
                    onChange={() => handleConsentChange('personalization')}
                  />
                  <span className="consent-type personalization">Personalization Cookies</span>
                  <span className="consent-desc">Remember your preferences</span>
                </label>
              </div>
              
              <div className="consent-actions">
                <button 
                  className="save-preferences" 
                  onClick={saveConsentPreferences}
                >
                  Save Preferences
                </button>
                <button 
                  className="deny-all" 
                  onClick={() => {
                    setConsentPreferences({
                      necessary: true,
                      analytics: false,
                      marketing: false,
                      personalization: false
                    });
                  }}
                >
                  Deny Non-Essential
                </button>
                <button 
                  className="accept-all" 
                  onClick={() => {
                    setConsentPreferences({
                      necessary: true,
                      analytics: true,
                      marketing: true,
                      personalization: true
                    });
                  }}
                >
                  Accept All
                </button>
              </div>
            </div>
          </section>

          <section className="policy-updates">
            <h2>7. Policy Updates</h2>
            <p>
              We may update this policy periodically. Significant changes will be notified via email 
              or website notice 30 days before taking effect.
            </p>
            <div className="version-history">
              <h4>Version History:</h4>
              <ul>
                <li><strong>v2.1</strong> (2023-11-15) - Added CCPA compliance details</li>
                <li><strong>v2.0</strong> (2023-06-10) - GDPR compliance overhaul</li>
                <li><strong>v1.0</strong> (2022-01-05) - Initial policy release</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;