import { initializeApp } from 'firebase/app';
import './App.less';
import Todo from './components/todo';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'testing-todo-app-a1e1d.firebaseapp.com',
  projectId: 'testing-todo-app-a1e1d',
  storageBucket: 'testing-todo-app-a1e1d.appspot.com',
  messagingSenderId: '970510945239',
  appId: '1:970510945239:web:53a6b72774d883f84d1992',
};

const app = initializeApp(firebaseConfig);

function App() {
  return (
    <div className="App">
      <Todo />
    </div>
  );
}

export default App;
