import { useAppSelector } from '../../store/hooks';
import Todo from '../Todo';
import styles from './TodosList.module.less';

/**
 * Компонент, отвечающий за отображение списка задач
 */
export default function TodosList() {
  const todos = useAppSelector((store) => store.todos);

  const expiredTodos = todos.filter((todo) => Date.now() > todo.expirationDate);
  const notExpiredTodos = todos.filter((todo) => !expiredTodos.includes(todo));
  const openedTodos = notExpiredTodos.filter((todo) => todo.status === 'opened');
  const completedTodos = notExpiredTodos.filter((todo) => todo.status === 'completed');

  return (
    <div className={styles['todos-list']}>
      {
        [...openedTodos, ...completedTodos, ...expiredTodos]
          .map((todo) => <Todo todo={todo} key={todo.id} />)
      }
    </div>
  );
}
