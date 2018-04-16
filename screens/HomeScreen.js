import React, { Component } from 'react';
import { View, BackHandler, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {Notifications} from 'expo';
import { setActiveScreen, setValidationList, setValidationActiveTask, logoutUser, assignCars} from '../actions';
import {HOME_NAV, CAR_ASSIGN_URL, MAIN_COLOR, VALIDATION_LIST_URL} from '../constants';
import Footer from '../components/Footer';
import CarAvailable from '../components/CarAvailable';
import ValidationList from '../components/ValidationList';
import Steps from '../components/Steps';

class HomeScreen extends Component 
{
  constructor() {
    super();
    this._fetchCarsAssign = this._fetchCarsAssign.bind(this);
    this._fetchCarForValidation = this._fetchCarForValidation.bind(this);
    this._onBackPress = this._onBackPress.bind(this);
    this._setCarForValidationList = this._setCarForValidationList.bind(this);
    this._setCarAssigned = this._setCarAssigned.bind(this);
    this._errHandler = this._errHandler.bind(this);
  }

  state ={
    pageLoad: false,
  }

  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(this._fetchCarsAssign);
    this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this._onBackPress);

    this.props.user.type === 'manager' ? this._fetchCarForValidation() : this._fetchCarsAssign();

    this.props.setActiveScreen(HOME_NAV);
  }

  componentWillUnmount() {
    this.backHandlerListener.remove();
  }
  
  _errHandler = error => console.log(error)

  _fetchCarForValidation() {
    axios.post(VALIDATION_LIST_URL, {hotel_name: this.props.user.hotel_name})
      .then(this._setCarForValidationList)
      .catch(this._errHandler)
    ;
  }

  _fetchCarsAssign() {
    axios.post(CAR_ASSIGN_URL, this.props.user)
      .then(this._setCarAssigned)
      .catch(this._errHandler)
    ;
  }

  _setCarAssigned({data}) {
    this.props.assignCars(data);
    this.setState(() => ({ pageLoad: true}));
  }

  _setCarForValidationList({data}) {
    this.props.setValidationActiveTask(null);
    this.props.setValidationList(data);
    this.setState(() => ({ pageLoad: true}));
  }


  _loader() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={MAIN_COLOR} />
      </View>
    )
  }

  _onBackPress() {
    this.props.setActiveScreen(HOME_NAV);
    return true;
  }

  _homePage() {
    if(this.props.user.type === 'manager') {
      return (
        <View style={{ flex: 1 }}>
          <ValidationList />
          <Footer />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {this.props.car_assign.has_active_task ? <Steps /> : <CarAvailable />}
        <Footer />
      </View>
    );
  }

  render() {
    return this.state.pageLoad ? this._homePage() : this._loader();
  }
}
const mapStateToProps = ({ nav, car_assign, user }) => ({ nav, car_assign, user });

export default connect(mapStateToProps, { setActiveScreen, setValidationList, setValidationActiveTask, logoutUser, assignCars})(HomeScreen);
