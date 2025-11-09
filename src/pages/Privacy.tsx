import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-heading font-bold mb-2 text-foreground">
            {lang === "en" ? "Privacy Policy" : "Política de Privacidad"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Brashline ("we," "our," "us") respects your privacy and is committed to protecting your personal, business, and account information. This Privacy Policy explains how we collect, store, use, and protect your data when you use our website, services, or communication channels.
              </p>
              <p className="leading-relaxed">
                By subscribing, purchasing, or using Brashline's services, you consent to this Privacy Policy and to the automatic application of any updates or modifications posted on our website.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">1. Information We Collect</h2>
              <p className="leading-relaxed">
                We collect only the data necessary to provide and improve our services. This may include:
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">1.1 Personal and Business Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, phone number, and company name</li>
                <li>Billing and payment information</li>
                <li>Business details (industry, address, operating hours, etc.)</li>
                <li>Service preferences or plan selection</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">1.2 Platform Credentials and Access Data</h3>
              <p className="leading-relaxed">
                To perform services on your behalf, we may collect and store access credentials (usernames, passwords, tokens, or admin permissions) for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Social media accounts (e.g., Instagram, Facebook, Google, Yelp, Nextdoor)</li>
                <li>Websites and hosting platforms (e.g., WordPress, Shopify, Wix)</li>
                <li>Advertising or analytics platforms (e.g., Google Ads, Meta Ads, Amazon Seller, DoorDash, UberEats, Groupon)</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Credentials are used solely for authorized activities — managing, posting, and marketing your business as described in your plan or agreement.
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">1.3 Technical Data and Cookies</h3>
              <p className="leading-relaxed">
                We collect basic technical data such as IP address, browser type, and usage analytics via cookies to improve performance and security. You may disable cookies in your browser settings.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">2. How We Use Your Information</h2>
              <p className="leading-relaxed">
                Brashline uses collected information exclusively to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deliver and manage your subscribed services</li>
                <li>Access and manage platforms where we act on your behalf</li>
                <li>Communicate updates, performance reports, and billing information</li>
                <li>Troubleshoot account issues and provide support</li>
                <li>Improve website functionality and client experience</li>
              </ul>
              <p className="leading-relaxed mt-4">
                We do not sell, rent, or share your information with unrelated third parties for marketing purposes.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">3. Credential Handling & Security</h2>
              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">3.1 Secure Storage</h3>
              <p className="leading-relaxed">
                All credentials and sensitive data are encrypted and stored in a secure, access-restricted environment. Only authorized personnel working directly on your project can access them.
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">3.2 Usage Limitations</h3>
              <p className="leading-relaxed">
                Credentials are used exclusively for the purposes agreed upon — typically for posting, optimization, or campaign management.
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">3.3 Client Responsibility</h3>
              <p className="leading-relaxed">
                Clients remain responsible for maintaining their account security, including enabling two-factor authentication (2FA) where possible and using strong, unique passwords.
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">3.4 Non-Liability for External Breaches</h3>
              <p className="leading-relaxed">
                While Brashline takes data protection seriously, we are not responsible for losses, unauthorized access, or hacking resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform vulnerabilities or outages</li>
                <li>Third-party API issues</li>
                <li>Reused or weak passwords</li>
                <li>Security breaches outside Brashline's systems</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">4. Data Confidentiality & Sharing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All information shared with Brashline is treated as confidential.</li>
                <li>We do not share, disclose, or distribute your data to any third party, except:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>When legally required by court order or government request.</li>
                    <li>When necessary to use third-party tools directly related to your project (e.g., posting software, analytics dashboards).</li>
                  </ul>
                </li>
                <li>All third-party vendors used by Brashline comply with standard data protection practices.</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">5. Data Retention & Deletion</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We retain client information only as long as necessary to deliver services and comply with legal obligations.</li>
                <li>Upon cancellation or written request, Brashline will delete all stored credentials, access logs, and sensitive client data within 15 business days.</li>
                <li>Aggregated, non-identifiable analytics data may be retained for internal performance review.</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">6. Client Rights</h2>
              <p className="leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to or a copy of your stored data.</li>
                <li>Request correction or deletion of your information.</li>
                <li>Withdraw consent for data use (which may impact service delivery).</li>
                <li>Receive confirmation when your data has been deleted.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Requests may be submitted to <a href="mailto:privacy@brashline.com" className="text-primary hover:underline">privacy@brashline.com</a>.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">7. Third-Party Services & Integrations</h2>
              <p className="leading-relaxed">
                Brashline integrates with third-party platforms (e.g., Meta, Google, Shopify, DoorDash). Each platform has its own privacy policies and security standards.
              </p>
              <p className="leading-relaxed">
                Brashline does not control or assume responsibility for their data handling or downtime. Clients should review the respective platform policies.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">8. Data Transfers</h2>
              <p className="leading-relaxed">
                Brashline operates primarily in the United States. By using our services, you consent to the transfer and processing of your data within the U.S., where it will be protected under applicable privacy laws.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">9. Attribution & Marketing Use</h2>
              <p className="leading-relaxed">
                Brashline may display "Powered by Brashline," "Managed by Brashline," or similar credits on digital assets or social pages it manages, unless otherwise requested in writing.
              </p>
              <p className="leading-relaxed">
                We may showcase non-confidential completed work (e.g., designs, ads, or screenshots) in our portfolio or marketing materials to demonstrate results. Sensitive business data will never be publicly shared.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">10. Policy Updates & Automatic Consent</h2>
              <p className="leading-relaxed">
                Brashline may update this Privacy Policy periodically to reflect service, legal, or technical changes.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Updates take effect immediately upon posting on our website.</li>
                <li>By continuing to use our services or maintaining an active subscription, you automatically consent to the most recent version of this policy and all related documents.</li>
                <li>The most current version is always available at brashline.com/legal (or equivalent).</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">11. Contact Information</h2>
              <p className="leading-relaxed">
                For privacy or data inquiries, contact:
              </p>
              <p className="leading-relaxed">
                Email: <a href="mailto:privacy@brashline.com" className="text-primary hover:underline">privacy@brashline.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
