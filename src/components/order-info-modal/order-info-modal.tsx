import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info/order-info';

type TOrderInfoModalProps = {
  returnTo: string;
};

export const OrderInfoModal: FC<TOrderInfoModalProps> = ({ returnTo }) => {
  const navigate = useNavigate();
  const { number: orderNumber } = useParams<{ number: string }>();

  return (
    <Modal onClose={() => navigate(returnTo)} title={`#0${orderNumber}` || ''}>
      <OrderInfo />
    </Modal>
  );
};
