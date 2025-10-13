import LoaderSvg from './icons/loader.svg';
import styles from './styles.module.scss';

export const Loader = () => {
  return (
    <img className={styles['loader']} src={LoaderSvg} alt="loading..."></img>
  );
};
