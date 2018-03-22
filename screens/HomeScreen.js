import React, { Component } from 'react';
import { View, BackHandler, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {Notifications} from 'expo';
import { setActiveScreen, logoutUser, assignCars} from '../actions';
import {HOME_NAV, CAR_ASSIGN_URL, MAIN_COLOR} from '../constants';
import Footer from '../components/Footer';
import CarAvailable from '../components/CarAvailable';
import ValidationList from '../components/ValidationList';
import Steps from '../components/Steps';

class HomeScreen extends Component 
{
  state ={
    pageLoad: false,
  }

  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(() => this._fetchCarsAssign());
    this.backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress', 
      () => {
        this.props.setActiveScreen(HOME_NAV);
        return true;
      }
    );

    this._fetchCarsAssign();
    this.props.setActiveScreen(HOME_NAV);
  }

  componentWillUnmount() {
    this.backHandlerListener.remove();
  }

  _fetchCarsAssign() {
    axios.post(CAR_ASSIGN_URL, this.props.user).then(({data}) => {
      this.props.assignCars(data);
      this.setState(() => ({ pageLoad: true}));
    }).catch((error) => { console.error(error); });
  }

  _loader() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={MAIN_COLOR} />
      </View>
    )
  }

  _homePage() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.car_assign.has_active_task ? <Steps /> : <CarAvailable />}
        <Footer />
      </View>
    );
  }

  render() {
    if(this.props.user.type === ' manager') {
      return (
        <ValidationList />
      );
    }

    return this.state.pageLoad ? this._homePage() : this._loader();
  }
}
const mapStateToProps = ({ nav, car_assign, user }) => ({ nav, car_assign, user });

export default connect(mapStateToProps, { setActiveScreen, logoutUser, assignCars})(HomeScreen);
