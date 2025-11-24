import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info/order-info';
import { clearOrderByNumber } from '../../services/slices/orderSlice';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';

type TOrderInfoModalProps = {
  returnTo: string;
};

export const OrderInfoModal: FC<TOrderInfoModalProps> = ({ returnTo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { number: orderNumber } = useParams<{ number: string }>();

  useEffect(
    () => () => {
      dispatch(clearOrderByNumber());
    },
    []
  );

  return (
    <Modal onClose={() => navigate(returnTo)} title={`#0${orderNumber}` || ''}>
      <OrderInfo />
    </Modal>
  );
};
