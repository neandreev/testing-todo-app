import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import './App.less';
import TodoDetails from './components/TodoDetails';
import TodoInput from './components/TodoInput';
import TodosList from './components/TodosList';
import { useAppSelector } from './store/hooks';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'testing-todo-app-a1e1d.firebaseapp.com',
  projectId: 'testing-todo-app-a1e1d',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_URL,
  messagingSenderId: '970510945239',
  appId: '1:970510945239:web:53a6b72774d883f84d1992',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

function App() {
  const currentTodoId = useAppSelector((store) => store.currentTodoId);

  return (
    <div className="App">
      <h1 className="Header">Список задач</h1>
      <div className="layout">
        <div className="left-column">
          <TodosList />
        </div>
        <div className="right-column">
          <TodoInput />
          {currentTodoId && <TodoDetails />}
        </div>
      </div>
      {/* <div style={{ display: 'grid', 'grid-template-columns': '300px 1fr' }}>
        <div>filter</div>
        <TodoInput />
        <TodosList />
        {currentTodoId && <TodoDetails />}
      </div> */}
    </div>
  );
}

export default App;
