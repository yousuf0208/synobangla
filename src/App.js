import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const searchWord = async () => {
    if (!word) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
      const data = await res.json();
      const syn = data.slice(0, 5).map(d => d.word);
      const antRes = await fetch(`https://api.datamuse.com/words?rel_ant=${word}`);
      const antData = await antRes.json();
      const ant = antData.slice(0, 5).map(d => d.word);
      const example = `This is an example using "${word}".`;
      const finalResult = { syn, ant, example };
      setResult(finalResult);

      const updatedHistory = [word, ...history.filter(w => w !== word)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('history', JSON.stringify(updatedHistory));
    } catch (e) {
      setResult({ syn: [], ant: [], example: 'No data found.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${theme}`}>
      <header>
        <h1>SynoBangla</h1>
        <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'}</button>
      </header>
      <main>
        <input value={word} onChange={e => setWord(e.target.value)} placeholder="Enter word..." />
        <button onClick={searchWord}>Search</button>
        {loading && <p>Loading...</p>}
        {result && (
          <div className="result">
            <h3>Synonyms:</h3>
            <ul>{result.syn.map((s, i) => <li key={i}>{s} - <i>(বাংলা মানে)</i></li>)}</ul>
            <h3>Antonyms:</h3>
            <ul>{result.ant.map((a, i) => <li key={i}>{a} - <i>(বাংলা মানে)</i></li>)}</ul>
            <p><b>Example:</b> {result.example}</p>
          </div>
        )}
        <div className="history">
          <h4>History</h4>
          <ul>{history.map((h, i) => <li key={i}>{h}</li>)}</ul>
        </div>
      </main>
      <footer>Made by Yousuf</footer>
    </div>
  );
}

export default App;
