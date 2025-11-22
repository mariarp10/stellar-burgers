import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info/order-info';

export const OrderInfoModal: FC = () => {
  const navigate = useNavigate();
  const { number: orderNumber } = useParams<{ number: string }>();

  return (
    <Modal
      onClose={() => navigate(-1)}
      title={orderNumber ? `#0${orderNumber}` : ''}
    >
      <OrderInfo />
    </Modal>
  );
};
