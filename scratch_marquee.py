import os

cwd = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI'
landing_file = os.path.join(cwd, r'frontend\src\components\LandingPage.jsx')
with open(landing_file, 'r', encoding='utf-8') as f:
    landing_text = f.read()

marquee_html = """
      {/* Marquee Section */}
      <div style={{ overflow: 'hidden', padding: '2rem 0', background: 'white', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginTop: '4rem' }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marquee 25s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '600', fontSize: '1.2rem' }}><Scale size={24} /> Supreme Court of India</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '600', fontSize: '1.2rem' }}><BookOpen size={24} /> Bar Council</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '600', fontSize: '1.2rem' }}><ShieldAlert size={24} /> Ministry of Law & Justice</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '600', fontSize: '1.2rem' }}><FileText size={24} /> BNS 2023 Compliant</div>
            </div>
          ))}
        </div>
      </div>
"""

if "Marquee Section" not in landing_text:
    landing_text = landing_text.replace("</section>\n\n      {/* Interactive Demo Section */}", "</section>\n" + marquee_html + "\n      {/* Interactive Demo Section */}")
    
with open(landing_file, 'w', encoding='utf-8') as f:
    f.write(landing_text)
