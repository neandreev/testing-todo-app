import styles from './Loader.module.less';

interface LoaderProps {
  percentage?: number;
}

/**
 * Компонент, отвечающий за отображение анимации загрузки
 * @param {number} percentage Число процентов для отображения в анимации
 */
export default function Loader({ percentage }: LoaderProps) {
  return (
    <div className={styles.loader}>
      <div className={styles['lds-default']}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      {percentage !== undefined && (
        <span className={styles.percentage}>
          {`${percentage}%`}
        </span>
      )}
    </div>
  );
}
