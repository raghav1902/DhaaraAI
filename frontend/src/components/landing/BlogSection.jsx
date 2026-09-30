import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function BlogSection({ onSelectArticle }) {
  const posts = [
    {
      tag: 'BNS 2023 REFORM',
      readTime: '5 min read',
      title: 'Navigating the New BNS Criminal Framework',
      desc: 'An essential breakdown of how Section 420 IPC, 302 IPC, and CrPC remand powers have evolved under the Bharatiya Nyaya Sanhita.',
      img: '/assets/legal/statutes/bns_statute_codes.webp',
      modalKey: 'Blog'
    },
    {
      tag: 'AI & LEGAL TECH',
      readTime: '4 min read',
      title: 'How Generative AI is Reshaping Indian High Courts',
      desc: 'Examining recent judicial trends toward digital case dockets and automated precedent retrieval across major High Courts.',
      img: '/assets/legal/library/law_library.webp',
      modalKey: 'Blog'
    },
    {
      tag: 'CONTRACT ADVISORY',
      readTime: '6 min read',
      title: 'Top 5 Overlooked Clauses in Commercial Contracts',
      desc: 'From unilateral arbitration clauses to non-compete enforceability under Section 27, learn what modern legal tech catches.',
      img: '/assets/legal/contracts/contract_audit.webp',
      modalKey: 'Blog'
    }
  ];

  return (
    <section className="landing-section" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div className="eyebrow-badge">
            <BookOpen size={14} /> LATEST LEGAL TECH INSIGHTS
          </div>
          <h2 className="landing-section-title" style={{ margin: 0 }}>
            Legal Insights & Statutory Guides
          </h2>
        </div>

        <button
          onClick={() => onSelectArticle('Blog')}
          style={{
            background: 'none',
            border: 'none',
            color: '#1d4ed8',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: 0
          }}
        >
          <span>View all articles</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* 3 Horizontal Thumbnail Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem'
      }} className="blog-cards-grid">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className="premium-card"
            onClick={() => onSelectArticle(post.modalKey)}
            style={{
              padding: 0,
              overflow: 'hidden',
              borderRadius: '18px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
              border: '1px solid #e7e3da'
            }}
          >
            {/* Thumbnail Image */}
            <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={post.img}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(11, 19, 41, 0.75)',
                backdropFilter: 'blur(6px)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '3px 9px',
                borderRadius: '6px',
                letterSpacing: '0.04em'
              }}>
                {post.tag} • {post.readTime}
              </div>
            </div>

            {/* Post Content */}
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0b1329',
                lineHeight: '1.35',
                marginBottom: '0.5rem'
              }}>
                {post.title}
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '0.84rem',
                lineHeight: '1.6',
                margin: '0 0 1.25rem 0',
                flex: 1
              }}>
                {post.desc}
              </p>
              <div style={{
                color: '#1d4ed8',
                fontWeight: '600',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span>Read analysis</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
