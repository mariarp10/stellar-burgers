import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useEffect } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector((state: RootState) => state.feed.orders);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch, orders]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
