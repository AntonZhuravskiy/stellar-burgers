import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  pathname,
  isAuthenticated
}) => {
  const isConstructor = pathname === '/';
  const isFeed = pathname === '/feed';
  const isProfile =
    pathname.startsWith('/profile') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={styles.link}>
            <BurgerIcon type={isConstructor ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${!isConstructor && styles.text_inactive}`}
            >
              Конструктор
            </p>
          </Link>
          <Link to='/feed' className={styles.link}>
            <ListIcon type={isFeed ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${!isFeed && styles.text_inactive}`}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <Link to='/' className={styles.logo}>
          <Logo className='' />
        </Link>
        <Link
          to='/profile'
          className={`${styles.link} ${styles.link_position_last}`}
        >
          <ProfileIcon type={isProfile ? 'primary' : 'secondary'} />
          <p
            className={`text text_type_main-default ml-2 ${!isProfile && styles.text_inactive}`}
          >
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};
