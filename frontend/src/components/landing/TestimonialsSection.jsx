import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="section-container" style={{ background: 'white', borderRadius: '28px', border: '1px solid #e2e8f0' }}>
      <div className="section-header">
        <div className="feature-badge"><Star size={14} /> Social Proof</div>
        <h2 className="section-title">Loved by Advocates & Legal Counsel</h2>
        <p className="section-desc">See how legal professionals are saving tens of hours every week with DhaaraAI.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.75rem'
      }}>
        {/* Review 1 */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              "DhaaraAI cut my case research time from hours to minutes. Being able to find pinpoint Supreme Court citations and check BNS provisions right from the bench is game-changing."
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
              RM
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>Rajesh Malhotra</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Senior Advocate, Delhi High Court</div>
            </div>
          </div>
        </div>

        {/* Review 2 */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              "As a startup founder, legal retainers were draining our runway. DhaaraAI audits vendor agreements in 60 seconds and redlines aggressive indemnity clauses accurately."
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
              PS
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>Priya Sharma</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Founder & CEO, TechScale Logistics</div>
            </div>
          </div>
        </div>

        {/* Review 3 */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              "The BNS to IPC converter and automated citation engine saved our junior associates hundreds of late-night hours during criminal trial preparations. Brilliant execution."
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#9333ea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
              VS
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>Vikramaditya Sen</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Managing Partner, Sen & Associates Law</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
