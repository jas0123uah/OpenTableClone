import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import SplashPage from './components/splashPage';
import HomePage from './components/HomePage';
import Restaurant from './components/Restaurant';
import { authenticate } from './store/session';
import NewRestaurant from './components/NewRestaurant';
import Favorites from './components/Favorites';
import Profile from './components/UserProfile';
import EditRestaurant from './components/EditRestaurant';
import { getRestaurants } from './store/restaurant';
import { getCuisineTypes } from './store/cuisine_types';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
<<<<<<< HEAD
      await dispatch(getRestaurants());
      await dispatch(getCuisineTypes()).then(() => setLoaded(true));
=======

      setLoaded(true);
>>>>>>> 37f0d05 (edit/delete thunks tested)
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

<<<<<<< HEAD
  const Routes = () => {
    return (
      <>
=======

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <SplashPage />
        </Route>
>>>>>>> 37f0d05 (edit/delete thunks tested)
        <Route path="/home">
          <HomePage />
        </Route>
        <ProtectedRoute exact path="/restaurants/new">
          <NewRestaurant />
        </ProtectedRoute>
        <Route exact path="/restaurants/:restaurantId/edit">
          <EditRestaurant />
        </Route>
        <Route exact path="/restaurants/:restaurantId">
          <Restaurant />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <Route path="/favorites">
          <Favorites />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </>
    );
  };

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <SplashPage />
        </Route>
        {loaded ? <Routes /> : null}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
