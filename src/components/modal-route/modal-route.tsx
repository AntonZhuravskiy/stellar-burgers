import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal';

type ModalRouteProps = {
  title: string;
  children: ReactNode;
};

export const ModalRoute: FC<ModalRouteProps> = ({ title, children }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};
