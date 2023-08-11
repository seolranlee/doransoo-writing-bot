import { useState } from 'react';
import useRandomQuotes from './hooks/useRandomQuotes';
import {
  requestGenerateRandomQuoteToPlugin,
  replaceTargetTextNodesToPlugin,
  setOpacityPlugin,
} from './lib/figma';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const getRandomQuote = useRandomQuotes();

  const generateRandomQuote = async () => {
    setIsLoading(true);
    const randomQuote = await getRandomQuote();
    requestGenerateRandomQuoteToPlugin(randomQuote);
    setIsLoading(false);
  };

  const replaceTarget = () => {
    replaceTargetTextNodesToPlugin();
  };

  const setOpacity = () => {
    setOpacityPlugin();
  };

  return (
    <div>
      <h1>DORANSOO</h1>
      <button onClick={setOpacity}>Opacity 조절</button>
      <button onClick={generateRandomQuote}>{isLoading ? 'Loading...' : 'Random Quote'}</button>
      <button onClick={replaceTarget}>숨고페이</button>
    </div>
  );
}

export default App;
