import { useState, SyntheticEvent } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../store/hooks';
import { addTodo, TodoI } from '../../store/todosSlice';
import styles from './TodoInput.module.less';

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

/**
 * Компонент, отвечающий за ввод и добавление новой задачи в список задач.
 */
export default function TodoInput() {
  const dispatch = useAppDispatch();

  const [todo, updateTodo] = useState('');
  const [todoDate, updateTodoDate] = useState('');

  const handleAddTask = (e: SyntheticEvent) => {
    e.preventDefault();

    const newTodo: TodoI = {
      id: nanoid(),
      todo,
      filesUrls: [],
      expirationDate: Date.parse(todoDate),
      description: '',
      status: 'opened',
    };

    dispatch(addTodo(newTodo));

    updateTodo('');
    updateTodoDate('');
  };

  return (
    <div className={styles['todo-input']}>
      <form onSubmit={(e) => handleAddTask(e)}>
        <div className={styles['todo-form']}>
          <div>
            <input
              placeholder="Название задачи"
              className="input"
              autoComplete="off"
              type="text"
              maxLength={120}
              onChange={(e) => updateTodo(e.currentTarget.value)}
              value={todo}
              name="todo"
              required
            />
            <input
              className="input"
              autoComplete="off"
              type="datetime-local"
              onChange={(e) => updateTodoDate(e.currentTarget.value)}
              value={todoDate}
              min={dayjs(Date.now() - timezoneOffset).toISOString().slice(0, 16)}
              name="todo-date"
              required
            />
          </div>
          <button className="button" type="submit">Добавить</button>
        </div>
      </form>
    </div>
  );
}
