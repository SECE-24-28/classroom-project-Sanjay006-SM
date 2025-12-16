import "./App.css";
import Display from "./components/display";
import Imageoi from "./components/imageoi";
function App() {
  return (
    <div className="App">
      <h1>Welcome to the Apple Demo App!</h1>
      <p>This is a simple React application demonstrating a basic setup.</p>
      <Display />
      <Imageoi />
    </div>
  );
}

export default App;