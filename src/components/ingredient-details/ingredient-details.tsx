import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { RootState, useSelector, useDispatch } from '../../services/store';

type TIngredientDetailsProps = {
  asPage?: boolean;
};

export const IngredientDetails: FC<TIngredientDetailsProps> = ({ asPage }) => {
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
