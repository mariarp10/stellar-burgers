import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useEffect } from 'react';

type IngredientDetailsProps = {
  asPage?: boolean;
};

export const IngredientDetails: FC<IngredientDetailsProps> = ({ asPage }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(
    (state: RootState) => state.ingredientsArray.ingredients
  );

  const ingredientData = ingredients.find((item) => item._id === id) ?? null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI ingredientData={ingredientData} asPage={asPage} />
  );
};
