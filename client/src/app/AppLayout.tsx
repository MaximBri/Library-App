import { Footer } from '@/widgets/footer/Footer';
import { Header } from '@/widgets/header/Header';
import styles from './styles.module.scss';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
