import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  removeTodo, setCurrentTodo, removeCurrentTodo, TodoI, updateTodo,
} from '../../store/todosSlice';
import styles from './Todo.module.less';

import { ReactComponent as DeleteIcon } from './delete.svg';
import { ReactComponent as CheckBoxIcon } from './check_box.svg';
import { ReactComponent as CheckBoxCheckedIcon } from './check_box_checked.svg';

interface TodoProps {
  todo: TodoI;
}

function getTodoClassName(isExpired: boolean, isTodoOpened: boolean) {
  if (isExpired) return styles['expired-todo'];
  if (isTodoOpened) return styles['opened-todo'];
  return styles['closed-todo'];
}

/**
 * Компонент, отвечающий за отображение задачи в списке задач.
 * @param todo Объект, содержащий в себе все основных характеристики задачи.
 */
export default function Todo({ todo }: TodoProps) {
  const dispatch = useAppDispatch();
  const currentTodoId = useAppSelector((store) => store.currentTodoId);

  const isTodoOpened = todo.status === 'opened';

  const handleSetCurrentTodo = () => {
    dispatch(setCurrentTodo(todo.id));
  };

  const handleDeleteTodo = () => {
    if (currentTodoId && currentTodoId === todo.id) dispatch(removeCurrentTodo());
    dispatch(removeTodo(todo.id));
  };

  const handleCloseTask = () => {
    if (currentTodoId === todo.id) dispatch(removeCurrentTodo());
    dispatch(updateTodo({ id: todo.id, todo: { status: 'completed' } }));
  };

  const handleOpenTask = () => {
    dispatch(updateTodo({ id: todo.id, todo: { status: 'opened' } }));
  };

  const isExpired = Date.now() > todo.expirationDate;

  const todoClassName = getTodoClassName(isExpired, isTodoOpened);

  return (
    <div className={styles.todo} tabIndex={0} role="button">
      <div className={todoClassName} onClick={handleSetCurrentTodo}>{todo.todo}</div>
      <div className={styles['todo-actions']}>
        <span
          className="icon"
          onClick={isTodoOpened ? handleCloseTask : handleOpenTask}
        >
          {
            isTodoOpened
              ? <CheckBoxIcon />
              : <CheckBoxCheckedIcon />
          }
        </span>
        {/* <span onClick={handleDeleteTodo} className="material-symbols-rounded icon"> */}
        <span onClick={handleDeleteTodo} className="icon">
          <DeleteIcon />
        </span>
      </div>
    </div>
  );
}
