import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export const Footer = () => {
  return (
    <footer className={styles['footer']}>
      Разработано
      <Link
        to={'https://t.me/Maxim_Bars'}
        target="_blank"
        className={styles['footer__link']}
      >
        @Maxim_Bars
      </Link>
    </footer>
  );
};
