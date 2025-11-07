import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1 py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-heading font-bold mb-2 text-foreground">
            {lang === "en" ? "Terms & Conditions" : "Términos y Condiciones"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Welcome to Brashline ("we," "our," "us"). By subscribing, purchasing, or using our website and services, you ("client," "you") agree to the following Terms & Conditions and our Privacy Policy. If you do not agree, do not use our services.
              </p>
              <p className="leading-relaxed">
                Brashline may update these Terms, the Privacy Policy, or related policies at any time. Updates take effect immediately upon posting. Continued use of our services after an update constitutes automatic acceptance of the latest version.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">1. Scope of Services</h2>
              <p className="leading-relaxed">
                Brashline provides digital marketing and technology services including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Social media management and organic posting</li>
                <li>Website design, development, and hosting support</li>
                <li>SEO and local visibility optimization</li>
                <li>Ad management across Google, Meta, Yelp, and others</li>
                <li>E-commerce setup and marketplace integration (Amazon, Shopify, DoorDash, UberEats, Groupon, etc.)</li>
                <li>Branding, content creation, and automation tools</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Each service is outlined by your selected plan or agreement.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">2. Client Credentials & Access</h2>
              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">2.1 Credential Provision</h3>
              <p className="leading-relaxed">
                To perform services, clients may be asked to provide platform credentials (e.g., usernames, passwords, access tokens, API keys, or admin permissions) for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Social media accounts (Instagram, Facebook, Nextdoor, Yelp, Google Business, etc.)</li>
                <li>Website platforms (WordPress, Shopify, Wix, etc.)</li>
                <li>Advertising accounts (Google Ads, Meta Ads, etc.)</li>
                <li>Analytics or email systems</li>
              </ul>
              <p className="leading-relaxed mt-4">
                By providing credentials, you authorize Brashline to access, manage, modify, and post content on your behalf strictly for the purpose of promoting your business and delivering contracted services.
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">2.2 Security & Responsibility</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Brashline secures all credentials using encrypted storage and limited staff access.</li>
                <li>Clients are responsible for ensuring provided credentials are accurate, functional, and current.</li>
                <li>Brashline strongly recommends enabling two-factor authentication (2FA) wherever available.</li>
                <li>Brashline will never change your credentials without written consent.</li>
                <li>Clients remain responsible for monitoring and maintaining their accounts' overall security and activity.</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">2.3 Liability Limitation</h3>
              <p className="leading-relaxed">
                While we maintain strict confidentiality and follow best security practices, Brashline is not liable for any account hacking, unauthorized access, suspension, or data loss resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform vulnerabilities or third-party system breaches</li>
                <li>Weak or reused passwords</li>
                <li>Client-side device compromise</li>
                <li>Changes made directly by the client or third parties</li>
              </ul>
              <p className="leading-relaxed mt-4">
                If a client's account is compromised, Brashline will provide reasonable technical support to assist recovery but assumes no financial or operational liability for losses.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">3. Authorization for Marketing Activity</h2>
              <p className="leading-relaxed">
                By subscribing, you grant Brashline ongoing permission to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create, upload, and schedule posts, advertisements, and campaigns representing your brand.</li>
                <li>Modify or optimize existing listings, pages, or metadata to improve visibility.</li>
                <li>Engage or respond to comments, messages, and reviews on your behalf when requested.</li>
                <li>Use your logos, trademarks, and public business information solely for marketing or representation purposes related to your project.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                All activity will be conducted in the best interest of your business and consistent with your selected service plan.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">4. Attribution & Branding Rights</h2>
              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">4.1 Branding Placement</h3>
              <p className="leading-relaxed">
                Brashline reserves the right to include discreet branding credits such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>"Powered by Brashline" (website footers or digital assets)</li>
                <li>"Managed by Brashline" (social bios, descriptions, or campaign notes)</li>
                <li>"Created by Brashline" (graphics, media, or deliverables)</li>
              </ul>
              <p className="leading-relaxed mt-4">
                These attributions serve to identify Brashline as the service provider and may appear across relevant managed platforms.
              </p>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">4.2 Removal of Attribution</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Attribution removal requests must be made in writing.</li>
                <li>Depending on your plan, removal may incur a small one-time fee to cover licensing and customization rights.</li>
                <li>Once removed, you may not reuse Brashline's brand name, media templates, or associated assets without permission.</li>
              </ul>

              <h3 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">4.3 Portfolio Rights</h3>
              <p className="leading-relaxed">
                Brashline may showcase completed, non-confidential work (e.g., screenshots, websites, campaigns, testimonials) in our portfolio, advertising, or case studies to demonstrate results. Sensitive or proprietary materials will not be shared without written consent.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">5. Payments & Billing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payments are due as specified in your plan or invoice.</li>
                <li>Subscription services renew automatically unless canceled before the next billing date.</li>
                <li>Fees are non-refundable once services begin.</li>
                <li>Brashline may suspend service for overdue payments or declined transactions.</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">6. Cancellations & Termination</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clients may cancel at any time by written notice or through their Brashline account.</li>
                <li>Services continue until the end of the current billing cycle.</li>
                <li>Brashline may terminate service for non-payment, breach of terms, or misuse.</li>
                <li>Upon termination, any unpaid fees remain due.</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">7. Ownership & Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upon full payment, clients own the final deliverables created specifically for them.</li>
                <li>Brashline retains ownership of proprietary code, frameworks, and tools used during production.</li>
                <li>Any unpaid work, drafts, or concepts remain Brashline property.</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">8. Confidentiality & Data Handling</h2>
              <p className="leading-relaxed">
                Brashline maintains all client information in strict confidence.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No data or credentials are shared externally except where legally required.</li>
                <li>Data is used solely for service fulfillment.</li>
                <li>Credentials are deleted upon project completion or client request.</li>
                <li>Brashline staff are bound by internal confidentiality agreements.</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">9. Limitation of Liability</h2>
              <p className="leading-relaxed">
                Brashline is not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account suspension, loss, or hacking.</li>
                <li>Indirect, incidental, or consequential damages.</li>
                <li>Third-party outages or API changes.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Our total liability shall not exceed the total amount paid by the client within the preceding 90 days.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">10. Updates to Terms & Policies</h2>
              <p className="leading-relaxed">
                By subscribing to Brashline, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>These Terms, the Privacy Policy, and related service policies may be updated periodically.</li>
                <li>Updates become effective immediately upon posting.</li>
                <li>Continued use of services or subscription renewal constitutes automatic acceptance of the latest version.</li>
                <li>The current versions will always be available on our website under "Legal."</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">11. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms are governed by the laws of the State of Florida, United States. Any disputes will be resolved in the appropriate courts within that jurisdiction.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-8 mb-4 text-foreground">12. Contact Information</h2>
              <p className="leading-relaxed">
                For questions regarding these Terms:
              </p>
              <p className="leading-relaxed">
                Email: <a href="mailto:support@brashline.com" className="text-primary hover:underline">support@brashline.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default Terms;
