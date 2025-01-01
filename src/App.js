import { useState } from 'react';
import './App.css';

const aspectRatios = [
  { label: '1:1 Square', width: 1024, height: 1024 },
  { label: '3:4 Portrait', width: 768, height: 1024 },
  { label: '4:3 Landscape', width: 1024, height: 768 },
  { label: '16:9 Widescreen', width: 1024, height: 576 },
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0]);

  async function generateImage(prompt) {
    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: selectedRatio.height,
          width: selectedRatio.width,
          steps: 30,
          samples: 1,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.artifacts[0].base64
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const base64Image = await generateImage(prompt);
      setImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="stars"></div>
      <div className="twinkling"></div>
      
      <div className="container">
        <div className="glass-panel">
          <div className="header">
            <h1>Image Vortex</h1>
            <p className="subtitle">Imagine the Future</p>
          </div>

          <form onSubmit={handleSubmit} className="prompt-form">
            <div className="aspect-ratio-selector">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.label}
                  type="button"
                  className={`aspect-ratio-btn ${selectedRatio === ratio ? 'active' : ''}`}
                  onClick={() => setSelectedRatio(ratio)}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
            
            <div className="input-group">
              <div className="prompt-box">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your imagination..."
                  className="prompt-input"
                  disabled={loading}
                />
                <div className="prompt-suggestions">
                  <span onClick={() => setPrompt("a magical forest at sunset")}>🌳 Magical Forest</span>
                  <span onClick={() => setPrompt("futuristic cyberpunk city")}>🌆 Cyberpunk City</span>
                  <span onClick={() => setPrompt("abstract cosmic art")}>🌌 Cosmic Art</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                className={`generate-btn ${loading ? 'loading' : ''}`}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <div className="loader">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                  </div>
                ) : (
                  <>
                    <span className="btn-text">Generate</span>
                    <span className="btn-icon">✨</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {image && (
            <div className="generated-section">
              <h2>Your Creation</h2>
              <div className="image-frame">
                <img src={image} alt="Generated" className="generated-image" />
                <p className="prompt-text">{prompt}</p>
                <div className="action-buttons">
                  <a 
                    href={image} 
                    download="ai-dreamscape.png" 
                    className="action-btn download-btn"
                  >
                    <span className="btn-icon">⭳</span>
                    <span>Download</span>
                  </a>
                  <button 
                    className="action-btn share-btn"
                    onClick={() => navigator.clipboard.writeText(image)}
                  >
                    <span className="btn-icon">⎘</span>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="generation-placeholder">
              <div className="pulse-effect"></div>
              <p>Creating your masterpiece...</p>
            </div>
          )}
          
          {!image && !loading && (
            <div className="examples-section">
              <h2>Example Creations</h2>
              <div className="examples-grid">
                {[
                  { id: 1, prompt: "Warrior with lion in desert sunset" },
                  { id: 2, prompt: "Deep canyon with dramatic lighting" },
                  { id: 3, prompt: "Ancient botanical illustration" },
                  { id: 4, prompt: "Inclusive workplace diversity" },
                  { id: 5, prompt: "Gothic portrait with red roses" },
                  { id: 6, prompt: "Cozy winter cabin at night" },
                  { id: 7, prompt: "Leopard eye close-up" },
                  { id: 8, prompt: "Colorful double exposure portrait" },
                  { id: 9, prompt: "Modern architecture interior" },
                  { id: 10, prompt: "Asian beauty with gold elements" },
                  { id: 11, prompt: "Enchanted garden path" },
                  { id: 12, prompt: "Abstract digital landscape" },
                  { id: 13, prompt: "Cyberpunk city street" },
                  { id: 14, prompt: "Underwater fantasy scene" },
                  { id: 15, prompt: "Space exploration concept" },
                  { id: 16, prompt: "Steampunk mechanical creature" },
                  { id: 17, prompt: "Northern lights over mountains" },
                  { id: 18, prompt: "Floating islands in sunset" },
                  { id: 19, prompt: "Crystal cave with glowing minerals" },
                  { id: 20, prompt: "Time vortex portal" }
                ].map((item) => (
                  <div key={item.id} className="example-item">
                    <img src={`img${item.id}.jpg`} alt={item.prompt} />
                    <p className="example-prompt">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
