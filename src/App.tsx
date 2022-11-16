import { useState } from 'react'
import { initializeApp } from "firebase/app";
import reactLogo from './assets/react.svg'
import './App.less'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "testing-todo-app-a1e1d.firebaseapp.com",
  projectId: "testing-todo-app-a1e1d",
  storageBucket: "testing-todo-app-a1e1d.appspot.com",
  messagingSenderId: "970510945239",
  appId: "1:970510945239:web:53a6b72774d883f84d1992"
};

const app = initializeApp(firebaseConfig);

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
