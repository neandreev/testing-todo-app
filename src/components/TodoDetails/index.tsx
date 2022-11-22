import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ru';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { TodoI, updateTodo } from '../../store/todosSlice';
import { storage } from '../../App';
import styles from './TodoDetails.module.less';
import TodoFile from '../TodoFile';
import Loader from '../Loader';
import timezoneOffset from '../../utils';

dayjs.locale('ru');
dayjs.extend(localizedFormat);

/**
 * Компонент, отвечающий за отображение подробностей о задаче:
 * описание, дата завершения, прикрепленные файлы.
 */

export default function TodoDetails() {
  const dispatch = useAppDispatch();
  const currentTodoId = useAppSelector((state) => state.currentTodoId);
  const currentTodo = useAppSelector((state) => state.todos)
    .find((todo) => todo.id === currentTodoId) as TodoI;

  const [description, setDescription] = useState(currentTodo.description);
  const [todo, setTodo] = useState(currentTodo.todo);
  const [date, setDate] = useState(
    dayjs(currentTodo.expirationDate - timezoneOffset).toISOString().slice(0, 16),
  );
  const [file, setFile] = useState('');

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTodo, setIsEditingTodo] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadPercentage, setUploadPercentage] = useState(0);

  useEffect(() => {
    setDescription(currentTodo.description);
    setTodo(currentTodo.todo);
    setDate(dayjs(currentTodo.expirationDate - timezoneOffset).toISOString().slice(0, 16));
  }, [currentTodo]);

  const handleApplyTodoDescription = () => {
    setIsEditingDescription(false);
    dispatch(updateTodo({ id: currentTodoId, todo: { description } }));
  };

  const handleApplyTodoExpirationDate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsEditingDate(false);
    dispatch(updateTodo({ id: currentTodoId, todo: { expirationDate: Date.parse(date) } }));
  };

  const handleApplyTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsEditingTodo(false);
    dispatch(updateTodo({ id: currentTodoId, todo: { todo } }));
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const file = files[0];

    if (!file) return;

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setFile(e.target.value);
    setIsUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadPercentage(progress);
      },
      (error) => {
        console.error(error);

        setIsUploading(false);
        setUploadPercentage(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const todoFile = { name: file.name, url: downloadURL };

          dispatch(updateTodo({
            id: currentTodoId,
            todo: { filesUrls: [...currentTodo.filesUrls, todoFile] },
          }));

          setFile('');
          setIsUploading(false);
          setUploadPercentage(0);
        });
      },
    );
  };

  return (
    <div className={styles.details}>
      {currentTodoId ? (
        <div>
          <div className={styles['todo-main-details']}>
            <div>
              {
                isEditingTodo
                  ? (
                    <form onSubmit={handleApplyTodo}>
                      <input
                        required
                        type="text"
                        autoFocus
                        value={todo}
                        maxLength={120}
                        className="input"
                        onChange={(e) => setTodo(e.target.value)}
                      />
                      <button className="button" type="submit">Обновить</button>
                    </form>
                  )
                  : (
                    <span
                      tabIndex={0}
                      role="textbox"
                      className={styles.todo}
                      onClick={() => setIsEditingTodo(true)}
                    >
                      {currentTodo.todo}
                    </span>
                  )
              }
            </div>
            <div>
              {
                isEditingDate
                  ? (
                    <form onSubmit={handleApplyTodoExpirationDate}>
                      <input
                        required
                        type="datetime-local"
                        autoFocus
                        value={date}
                        className="input"
                        min={dayjs(Date.now() - timezoneOffset).toISOString().slice(0, 16)}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      <button className="button" type="submit">Обновить</button>
                    </form>
                  )
                  : (
                    <span
                      tabIndex={0}
                      role="textbox"
                      onClick={() => setIsEditingDate(true)}
                    >
                      {`Сделать до: ${dayjs(currentTodo.expirationDate).format('lll')}`}
                    </span>
                  )
              }
            </div>
          </div>
          <div>
            {
              isEditingDescription
                ? (
                  <textarea
                    className={styles['description-input']}
                    autoFocus
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleApplyTodoDescription}
                  />
                )
                : (
                  <i
                    tabIndex={0}
                    role="textbox"
                    className={styles.description}
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {description || 'Описание задачи...'}
                  </i>
                )
            }
          </div>
          <div>
            <div className={styles.files}>
              <div>Загруженные файлы:</div>
              <label className="button">
                Добавить файл
                <input type="file" id="file-upload" value={file} className={styles['file-input']} onChange={(e) => handleUploadFile(e)} />
              </label>
            </div>
            <div className={styles['todo-files']}>
              {
                currentTodo.filesUrls.length > 0
                && currentTodo.filesUrls
                  .map((file) => (
                    <TodoFile file={file} key={file.url} todoId={currentTodoId} />
                  ))
              }
            </div>
          </div>
          {
            isUploading && <Loader percentage={uploadPercentage} />
          }
        </div>
      ) : 'no todos'}
    </div>
  );
}
