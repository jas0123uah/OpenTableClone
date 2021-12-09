import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview } from '../../store/restaurant';
import { useParams } from 'react-router';
import EditReviewModal from '../EditReview/EditReviewModal';
import './restaurant.css'

const Restaurant = () => {
  const { restaurantId } = useParams();
  const restaurant = useSelector((state) => state.restaurants[+restaurantId]);
  const dispatch = useDispatch();

  let reviews;
  const rawReviews = useSelector(
    (state) => state.restaurants[restaurantId]?.reviews
  );

  if (rawReviews) {
    reviews = Object.values(rawReviews);
  }


  const deleteOneReview = (id) => {
    dispatch(deleteReview(id));
  };

  return (
    <div className="restaurant-container">
      <img src={restaurant.cover_photo} className='coverPhoto'/>
      <h1>{restaurant?.name}</h1>
      <div>
        {reviews?.map((review) => {
          return (
            <div>
              {review.rating}
              {review.comment}
              <div>
                <EditReviewModal id={review.id} />
                <button onClick={() => deleteOneReview(review.id)}>
                  delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Restaurant;
