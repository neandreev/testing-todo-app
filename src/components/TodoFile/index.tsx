import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../../App';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { FileI, updateTodo } from '../../store/todosSlice';
import styles from './TodoFile.module.less';

interface TodoFilesProps {
  file: FileI;
  todoId: string;
}

/**
 * Компонент, отвечающий за отображение добавленного к задаче файла.
 * @param file Объект, содержащий название файла и ссылку на него.
 * @param todoId ID задачи, к которой прикреплен файл.
 */
export default function TodoFile({ file, todoId }: TodoFilesProps) {
  const storageRef = ref(storage, `files/${file.name}`);
  const dispatch = useAppDispatch();
  const currentTodo = useAppSelector((store) => store.todos)
    .find((todo) => todo.id === todoId);

  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      const downloadUrl = await getDownloadURL(storageRef);
      setUrl(downloadUrl);
    };

    fetchDownloadUrl();
  }, [storageRef]);

  const handleRemoveFile = () => {
    const filesUrls = currentTodo?.filesUrls;
    const newFilesUrls = filesUrls?.filter(({ url }) => url !== file.url);
    dispatch(updateTodo({ id: todoId, todo: { filesUrls: newFilesUrls } }));
  };

  return (
    <div className={styles['todo-file']}>
      <div>{file.name}</div>
      <div>
        <a href={url} style={{ all: 'unset' }}>
          <button type="button" className="button">Скачать</button>
        </a>
        <button type="button" className="button" onClick={handleRemoveFile}>Удалить</button>
      </div>
    </div>
  );
}
