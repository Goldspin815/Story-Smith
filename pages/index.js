import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [plot, setPlot] = useState('');
  const [pages, setPages] = useState(200);
  const [genre, setGenre] = useState('Fantasy');
  const [pace, setPace] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const res = await axios.post('/api/generate', { plot, pages, genre, pace });
    setOutput(res.data.text);
    setLoading(false);
  };

  const download = async (type) => {
    const res = await axios.post(`/api/export-${type}`, { text: output }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `book.${type}`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>📖 AI Book Writer</h1>
      <textarea
        placeholder="Describe your plot..."
        value={plot}
        onChange={(e) => setPlot(e.target.value)}
        rows={4}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="number"
        placeholder="Number of pages"
        value={pages}
        min={10}
        max={1000}
        onChange={(e) => setPages(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="text"
        placeholder="Genre (e.g. Fantasy, Romance)"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <select value={pace} onChange={(e) => setPace(e.target.value)} style={{ width: '100%', marginBottom: 10 }}>
        <option value="Slow">Slow</option>
        <option value="Medium">Medium</option>
        <option value="Fast">Fast</option>
      </select>
      <button onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Generating...' : 'Generate Book'}
      </button>

      {output && (
        <div style={{ marginTop: 20 }}>
          <h2>Generated Book</h2>
          <textarea value={output} readOnly rows={20} style={{ width: '100%' }} />
          <button onClick={() => download('docx')} style={{ marginTop: 10, marginRight: 10 }}>Download DOCX</button>
          <button onClick={() => download('pdf')} style={{ marginTop: 10 }}>Download PDF</button>
        </div>
      )}
    </div>
  );
    }
          
