import React, { useState } from 'react';
import { Zap, Loader, Copy, Download } from 'lucide-react';

export default function DMADashboard() {
  const [activeTab, setActiveTab] = useState('content');
  const [contentForm, setContentForm] = useState({
    clientName: '',
    industry: 'pest control',
    serviceOffering: '',
    painPoints: '',
    callToAction: 'Book Free Inspection',
    brandColors: 'Brand Colors',
    tone: 'professional, expert, urgent'
  });
  
  const [contentOutput, setContentOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const formatCalendarOutput = (data) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  };

  const generateContentCalendar = async () => {
    if (!contentForm.clientName || !contentForm.serviceOffering) {
      setError('Please fill in Client Name and Service Offering');
      return;
    }

    setLoading(true);
    setError(null);
    
    const prompt = `You are a Meta content strategist for home service businesses. Generate a detailed 30-day content calendar for:

Client: ${contentForm.clientName}
Industry: ${contentForm.industry}
Service: ${contentForm.serviceOffering}
Pain Points: ${contentForm.painPoints}
Call to Action: ${contentForm.callToAction}
Brand Colors: ${contentForm.brandColors}
Tone: ${contentForm.tone}

Requirements:
1. Create 30 days of content (6 posts per week)
2. Mix: 70% lead-gen, 30% brand/trust
3. Each post must include:
   - Day and date
   - Platform (Instagram Reel, Carousel, Static, Story)
   - Content type
   - Hook (0-3 second attention grabber)
   - Full caption (120-150 chars)
   - Hashtags (5-8)
   - CTA button text
   - Creative brief for Canva (visual angle, text overlays, color palette)
   - Engagement tactics
4. Include weekly themes
5. Include posting schedule (best days/times)
6. Include success metrics
7. Format as JSON with calendar array

Return ONLY valid JSON, no markdown or explanation.`;

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not configured. Contact admin.');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || response.status}`);
      }

      const data = await response.json();
      const textContent = data.content[0]?.text;
      
      if (!textContent) {
        throw new Error('No response from Claude');
      }

      const cleanJson = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      setContentOutput(parsed);
      setError(null);
    } catch (err) {
      setError(`Generation failed: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportCalendar = () => {
    if (!contentOutput) return;
    const dataStr = JSON.stringify(contentOutput, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `${contentForm.clientName}_calendar.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ backgroundColor: '#faf8f3', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ backgroundColor: '#3d2817', color: '#faf8f3', padding: '20px', borderBottom: '3px solid #c97a4b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>🏜️ DMA Command Center</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Desert Media Agency • Scaling to 50K/Month</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff5e6', borderBottom: '1px solid #e8d4c0', padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
          {[
            { id: 'content', label: '📱 Content Generator', icon: '✨' },
            { id: 'leads', label: '🎯 Lead Prospector', icon: '🔍' },
            { id: 'pipeline', label: '📊 Pipeline', icon: '📈' },
            { id: 'revenue', label: '💰 Revenue Tracker', icon: '$' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '15px 0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #c97a4b' : 'none',
                color: activeTab === tab.id ? '#3d2817' : '#999',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {activeTab === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <div>
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e8d4c0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#3d2817', fontSize: '18px', fontWeight: 'bold' }}>Client Brief</h2>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#3d2817', fontWeight: 'bold', fontSize: '13px' }}>
                    Client Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ProPest Phoenix"
                    value={contentForm.clientName}
                    onChange={(e) => setContentForm({ ...contentForm, clientName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d4c4b0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#3d2817', fontWeight: 'bold', fontSize: '13px' }}>
                    Industry *
                  </label>
                  <select
                    value={contentForm.industry}
                    onChange={(e) => setContentForm({ ...contentForm, industry: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d4c4b0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option>pest control</option>
                    <option>remodeling</option>
                    <option>plumbing/HVAC</option>
                    <option>electrical</option>
                    <option>landscaping</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#3d2817', fontWeight: 'bold', fontSize: '13px' }}>
                    Service Offering *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Termite & Pest Inspections"
                    value={contentForm.serviceOffering}
                    onChange={(e) => setContentForm({ ...contentForm, serviceOffering: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d4c4b0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#3d2817', fontWeight: 'bold', fontSize: '13px' }}>
                    Pain Points (comma-separated)
                  </label>
                  <textarea
                    placeholder="e.g., termite damage, recurring infestations, health risks"
                    value={contentForm.painPoints}
                    onChange={(e) => setContentForm({ ...contentForm, painPoints: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d4c4b0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'system-ui',
                      minHeight: '60px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#3d2817', fontWeight: 'bold', fontSize: '13px' }}>
                    Call to Action
                  </label>
                  <input
                    type="text"
                    value={contentForm.callToAction}
                    onChange={(e) => setContentForm({ ...contentForm, callToAction: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d4c4b0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#3d2817', fontWeight: 'bold', fontSize: '13px' }}>
                    Brand Colors
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Red & Black"
                    value={contentForm.brandColors}
                    onChange={(e) => setContentForm({ ...contentForm, brandColors: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d4c4b0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  onClick={generateContentCalendar}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: loading ? '#ccc' : '#c97a4b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Generating Calendar...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Generate 30-Day Calendar
                    </>
                  )}
                </button>

                {error && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    backgroundColor: '#ffe6e6',
                    color: '#c00',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>
            </div>

            <div>
              {contentOutput && (
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e8d4c0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#3d2817', fontSize: '18px', fontWeight: 'bold' }}>
                      📅 {contentForm.clientName} Calendar
                    </h2>
                    <button
                      onClick={exportCalendar}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f0e6d2',
                        border: '1px solid #d4c4b0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#3d2817'
                      }}
                    >
                      <Download size={14} /> Export JSON
                    </button>
                  </div>

                  {contentOutput.calendar && (
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {contentOutput.calendar.slice(0, 7).map((post, idx) => (
                        <div key={idx} style={{
                          marginBottom: '20px',
                          paddingBottom: '20px',
                          borderBottom: '1px solid #f0e6d2'
                        }}>
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#c97a4b' }}>
                              Day {post.day || idx + 1} • {post.platform || 'Instagram Reel'}
                            </span>
                          </div>
                          <p style={{ margin: '8px 0', fontSize: '13px', color: '#3d2817', fontWeight: 'bold' }}>
                            {post.hook || post.content_type || 'Hook text'}
                          </p>
                          <p style={{ margin: '8px 0', fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                            {post.captions?.primary || post.caption || 'Caption text'}
                          </p>
                          <button
                            onClick={() => copyToClipboard(post.captions?.primary || post.caption || '', idx)}
                            style={{
                              padding: '6px 10px',
                              fontSize: '11px',
                              backgroundColor: copiedIndex === idx ? '#d4f4dd' : '#f0e6d2',
                              border: '1px solid #d4c4b0',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              color: copiedIndex === idx ? '#008000' : '#3d2817'
                            }}
                          >
                            {copiedIndex === idx ? '✓ Copied!' : 'Copy Caption'}
                          </button>
                        </div>
                      ))}
                      <p style={{ fontSize: '12px', color: '#999', margin: '20px 0 0 0' }}>
                        Showing first 7 days. Export JSON to see full 30-day calendar.
                      </p>
                    </div>
                  )}

                  {contentOutput.content_mix && (
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0e6d2' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold', color: '#3d2817' }}>
                        Content Mix
                      </h3>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {contentOutput.content_mix.lead_gen && (
                          <p>📊 Lead-Gen: {contentOutput.content_mix.lead_gen}</p>
                        )}
                        {contentOutput.content_mix.brand_trust && (
                          <p>🎯 Brand/Trust: {contentOutput.content_mix.brand_trust}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!contentOutput && !loading && (
                <div style={{
                  backgroundColor: '#fff5e6',
                  padding: '40px 20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <p style={{ fontSize: '14px' }}>Fill in client details and click "Generate" to create a 30-day calendar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
            <p>🔍 Lead Prospector coming next...</p>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
            <p>📊 Pipeline Dashboard coming next...</p>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
            <p>💰 Revenue Tracker coming next...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
