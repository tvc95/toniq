import { playTestSound } from "./audio/AudioEngine";
import "./App.css";

function App() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-80 text-center space-y-4">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Toniq
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Ear Training App
          </p>
          <button className="btn-primary w-full">Começar</button>
          <button className="btn-ghost w-full">Ver histórico</button>
          <button className="btn-warning w-full" onClick={playTestSound}>
            Testar som
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
