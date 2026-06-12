"use client";

import React, { useState, useEffect } from 'react';
import { useField } from '@payloadcms/ui';

type Post = {
  id: string;
  imageUrl: string;
  link: string;
  isReel: boolean;
};

export const InstagramSelector: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<Post[]>({ path });
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sadece seçilmiş gönderileri Payload tarafında array olarak tutacağız
  const selectedPosts = Array.isArray(value) ? value : [];

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/fetch-instagram');
      const data = await res.json();
      if (data.success) {
        setFetchedPosts(data.posts);
      } else {
        setError(data.error || 'Veri çekilemedi.');
      }
    } catch (err) {
      setError('Bir bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (post: Post) => {
    const isSelected = selectedPosts.find(p => p.id === post.id);
    
    if (isSelected) {
      // Çıkar
      setValue(selectedPosts.filter(p => p.id !== post.id));
    } else {
      // Ekle (Maksimum 6)
      if (selectedPosts.length >= 6) {
        alert("En fazla 6 görsel seçebilirsiniz. Lütfen önce birini kaldırın.");
        return;
      }
      setValue([...selectedPosts, post]);
    }
  };

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Instagram Gönderi Seçicisi</h4>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Instagram'dan son gönderileri çekip, vitrinde görünecek en fazla 6 tanesini seçin. <br/>
            Şu an <b>{selectedPosts.length} / 6</b> görsel seçili. Seçim sıranız vitrindeki sıralamayı belirler.
          </p>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); handleFetch(); }}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#94a3b8' : '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600
          }}
        >
          {loading ? 'Çekiliyor...' : 'Son Gönderileri Çek'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      {fetchedPosts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {fetchedPosts.map((post) => {
            const selectedIndex = selectedPosts.findIndex(p => p.id === post.id);
            const isSelected = selectedIndex !== -1;

            return (
              <div 
                key={post.id}
                onClick={() => toggleSelect(post)}
                style={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '4px solid #f97316' : '1px solid #cbd5e1',
                  transition: 'all 0.2s',
                  opacity: (!isSelected && selectedPosts.length >= 6) ? 0.5 : 1
                }}
              >
                <img 
                  src={post.imageUrl} 
                  alt="Insta" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {selectedIndex + 1}
                  </div>
                )}
                {post.isReel && (
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '10px'
                  }}>
                    ▶
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {fetchedPosts.length === 0 && selectedPosts.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Mevcut Seçili Görseller (Önizleme)</h5>
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedPosts.map((post, i) => (
              <div key={post.id} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={post.imageUrl} alt="Insta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#f97316', color: 'white', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
