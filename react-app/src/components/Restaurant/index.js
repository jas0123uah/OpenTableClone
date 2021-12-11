import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeFavorite, deleteFavorite } from '../../store/favorites';
import { useParams, NavLink } from 'react-router-dom';
import EditReviewModal from '../EditReview/EditReviewModal';
import { deleteReview, getRestaurants } from '../../store/restaurant';
import CustomerBookReservationModal from '../CustomerBookReservation';
import {authenticate} from '../../store/session'
import CreateReview from '../NewReview/index'
import './restaurant.css';

const Restaurant = () => {
  const { restaurantId } = useParams();
  const [date, setDate] = useState('');
  const restaurant = useSelector((state) => state.restaurants[+restaurantId]);
  const user = useSelector((state) => state.session?.user);
  const dispatch = useDispatch();

  const userId = user.id

  let dollars = '';
  for (let i = 0; i < restaurant.price_point; i++) {
    dollars += '$ ';
  }

  let stars = '';
  let rating = 0;
  let ratings = [];
  if (restaurant.reviews) {
    for (let id in restaurant?.reviews) {
      ratings.push(restaurant?.reviews[id].rating);
      rating = (
        ratings?.reduce((prev, curr) => prev + curr) / ratings?.length
      ).toFixed(1);
    }
    if (ratings.length) {
      let ratingNumber =
        ratings?.reduce((prev, curr) => prev + curr) / ratings.length;
      for (let i = 0; i < 5; i++) {
        if (ratingNumber >= 1) stars += '★';
        // else if (ratingNumber > 0.25 && ratingNumber < .75) stars += '1/2'
        else stars += '☆';
        ratingNumber -= 1;
      }
    } else stars = '☆☆☆☆☆';
  }

  let reviewStars = '';
  const makeStars = (obj) => {
    reviewStars = '';
    const thisObj = { ...obj };
    for (let i = 0; i < 5; i++) {
      if (thisObj.rating >= 1) {
        reviewStars += '★';
        thisObj.rating -= 1;
      } else reviewStars += '☆';
    }
    return reviewStars;
  };

  let allReservations = useSelector((state) =>state.restaurants?.[restaurantId]?.reservations)
  let availableReservationsArray = allReservations.filter(res => res.booked === false).sort(function(a,b){
      return new Date(a.date) - new Date(b.date);
  })

  let reservationsByDate = availableReservationsArray.filter((reservation) => reservation.date == date)
  let arrayOfAvailableDates= availableReservationsArray.map((reservation) => reservation.date)
  let reviews;

  const rawReviews = useSelector(
    (state) => state.restaurants[restaurantId]?.reviews
  );

  if (rawReviews) {
    reviews = Object.values(rawReviews);
  }

  const deleteOneReview = (id) => {
    dispatch(deleteReview(id));
    dispatch(getRestaurants());
  };

  const makeFav = (restaurantId) => {
    dispatch(makeFavorite(+userId, +restaurantId));
    dispatch(authenticate())
    window.location.reload();
  };

  const delFav = (restId) => {
    let favId;
    for (let id in restaurant.favorites) {
      if (restaurant.favorites[id].restaurantId === restId) {
        favId = id;
      }
    }
    dispatch(deleteFavorite(favId, userId));
    dispatch(authenticate())
    window.location.reload();
  };


  const checkFavs = (restId) => {
    for (let id in restaurant.favorites) {
      if (restaurant.favorites[id]?.restaurantId === restId) return 'true';
      return 'false';
    }
  };

  const editOptions = () => {
    return (
      <p>
        <NavLink to={`/restaurants/${restaurantId}/edit`}>
          <i className="far fa-edit"></i>Admin Page
        </NavLink>
      </p>
    );
  };

  return (
    <div>
      <img
        src={restaurant.cover_photo}
        alt="restaurant cover"
        className="coverPhoto"
      />
      <div className="restaurant-container">
        <div className="header">
          <h1 className="restName">{restaurant?.name}</h1>

          {checkFavs(restaurant.id) ? (
            <button
              id="red"
              className="favButton"
              type="button"
              onClick={() => delFav(restaurant.id)}
            >
              <i className="fas fa-heart"></i>
            </button>
          ) : (
            <button
              className="favButton"
              type="button"
              onClick={() => makeFav(restaurant.id)}
            >
              <i className="far fa-heart"></i>
            </button>
          )}

          {userId === restaurant.ownerId ? editOptions() : null}
        </div>

        <div className="restDescriptionContainer">
          <div className="stars">
            {stars} <span className="rating">{rating}</span>
          </div>
          <div className="dots">●</div>
          <p>
            <i className="far fa-comments" id="icon"></i>
            {Object.keys(restaurant.reviews).length} reviews
          </p>
          <div className="dots">●</div>
          <p className="pricePoint">{dollars}</p>
          <div className="dots">●</div>
          <p className="cuisineType">
            <i className="fas fa-utensils" id="icon"></i>
            {restaurant.cuisine_type}
          </p>
        </div>

        <div className="contactContainer">
          <div className="hours">
            {' '}
            <i className="far fa-clock" id="icon"></i> Daily Hours:
            <div className="openTime">{restaurant.open_time} - </div>
            <div className="closeTime">{restaurant.close_time}</div>
          </div>

          <div className="location">
            {' '}
            <i className="fas fa-map-marker" id="icon"></i> Location:
            <div className="locationText"> {restaurant.location}</div>
          </div>

          <div className="contactUs">
            {' '}
            <i className="far fa-address-book" id="icon"></i> Contact Us:
            {restaurant.phone_number !== null ? (
              <div className="phone">{restaurant.phone_number}</div>
            ) : null}
            {restaurant.contact_email !== null ? (
              <div className="email">{restaurant.contact_email}</div>
            ) : null}
          </div>
        </div>

        <CustomerBookReservationModal
          className="reserve"
          arrayOfAvailableDates={arrayOfAvailableDates}
          availableReservationsArray={availableReservationsArray}
        />
        <p>{restaurant.description}</p>
      </div>

      {/* --- */}
      <div className="reviewsContainer">
        <h2 className="reviewsHeader">Reviews</h2>
        {Object.values(rawReviews)?.map((review) => {
          return (
            <div className="review">
              <div className="reviewContent">
                <div className="reviewUsername"><strong>{review.username}</strong> gave: </div>
                <div className="reviewRating">{makeStars(review)}</div>
                <div className="reviewComment">{review.comment}</div>
              </div>

              {userId === review.userId ? (
                <div className="ratingButtons">
                  <EditReviewModal id={review.id} className="ratingEdit" />
                  <button
                    onClick={() => deleteOneReview(review.id)}
                    className="ratingDelete"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {user? (
        <CreateReview />
      ): null}
    </div>
  );
};

export default Restaurant;
