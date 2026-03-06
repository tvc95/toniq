import { playTestSound } from "./audio/AudioEngine";
import "./App.css";

function App() {
  return (
    <>
      <h1>Toniq</h1>
      <div className="card">
        <button onClick={playTestSound}>Tocar som</button>
      </div>
    </>
  );
}

export default App;
