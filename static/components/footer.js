class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }
        footer {
          background-color: #020617; /* Slate 950 */
          color: #e2e8f0;
          padding: 4rem 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 3rem;
        }
        
        /* Logo Section */
        .brand-col {
          padding-right: 2rem;
        }
        .footer-logo {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          color: white;
          text-decoration: none;
        }
        .footer-logo img {
          height: 32px;
          margin-right: 12px;
        }
        .tagline {
          color: #94a3b8; /* Slate 400 */
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Links Sections */
        .footer-links h3 {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
          color: #fff;
        }
        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        .footer-links a {
          color: #94a3b8; /* Slate 400 */
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .footer-links a:hover {
          color: #6366f1; /* Indigo 500 */
          padding-left: 4px;
        }

        /* Bottom Section */
        .footer-bottom {
          max-width: 1200px;
          margin: 3rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .copyright {
          color: #64748b; /* Slate 500 */
          font-size: 0.875rem;
        }
        
        /* Social Icons */
        .social-links {
          display: flex;
          gap: 1.25rem;
        }
        .social-links a {
          color: #94a3b8;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-links a:hover {
          color: #6366f1; /* Indigo 500 */
          transform: translateY(-2px);
        }
        .social-links svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .brand-col {
            padding-right: 0;
            text-align: center;
          }
          .footer-logo {
            justify-content: center;
          }
          .footer-links {
            text-align: center;
          }
          .footer-bottom {
            flex-direction: column-reverse;
            text-align: center;
          }
        }
      </style>

      <footer>
        <div class="footer-container">
          
          <div class="brand-col">
            <a href="/" class="footer-logo">
              <img src='/9020930.png' alt="APINOW">
            </a>
            <p class="tagline">
              The unified interface for LLMs. Build, deploy, and scale your AI applications with a single API.
            </p>
          </div>

          <div class="footer-links">
            <h3>Product</h3>
            <ul>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/api">API Reference</a></li>
              <li><a href="/showcase">Showcase</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/security">Security</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>

        </div>
        
        <div class="footer-bottom">
          <p class="copyright">&copy; 2023-2025 APINOW Inc. All rights reserved.</p>
          
          <div class="social-links">
            <a href="https://discord.gg/example" aria-label="Discord">
              <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <a href="https://github.com/example" aria-label="GitHub">
              <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://twitter.com/example" aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="https://linkedin.com/example" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);