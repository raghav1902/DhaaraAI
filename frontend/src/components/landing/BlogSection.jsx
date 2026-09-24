import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function BlogSection({ onSelectArticle }) {
  const posts = [
    {
      tag: 'BNS 2023 REFORM',
      title: 'Navigating the New BNS Criminal Framework: What Lawyers Must Know',
      desc: 'An essential breakdown of how Section 420 IPC, 302 IPC, and CrPC remand powers have evolved under the Bharatiya Nyaya Sanhita.',
      readTime: '5 min read',
      modalKey: 'Blog'
    },
    {
      tag: 'ARTIFICIAL INTELLIGENCE',
      title: 'How Generative AI is Reshaping Indian High Courts & Case Precedents',
      desc: 'Examining recent judicial trends toward digital case dockets and automated precedent retrieval across major High Courts.',
      readTime: '4 min read',
      modalKey: 'Blog'
    },
    {
      tag: 'CONTRACT ADVISORY',
      title: 'Top 5 Overlooked Clauses in Standard Commercial Contracts',
      desc: 'From unilateral arbitration clauses to non-compete enforceability under Section 27, learn what modern legal tech catches.',
      readTime: '6 min read',
      modalKey: 'Blog'
    }
  ];

  return (
    <section className="section-container" style={{ background: 'white', borderRadius: '28px', border: '1px solid #e2e8f0' }}>
      <div className="section-header">
        <div className="feature-badge"><BookOpen size={14} /> Knowledge Center</div>
        <h2 className="section-title">Latest Legal Tech Insights</h2>
        <p className="section-desc">Practical guides on Indian statutory transitions, AI case law search, and contract engineering.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '1.75rem'
      }}>
        {posts.map((post, i) => (
          <div key={i} style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }} onClick={() => onSelectArticle(post.modalKey)}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#2563eb', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                {post.tag} • {post.readTime}
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.65rem', lineHeight: '1.4' }}>
                {post.title}
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                {post.desc}
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', color: '#2563eb', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Read full article <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
