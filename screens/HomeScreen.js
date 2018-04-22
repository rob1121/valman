import React, { Component } from 'react';
import { View, BackHandler, AsyncStorage, ActivityIndicator } from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {Notifications} from 'expo';
import { setActiveScreen } from '../actions';
import {HOME_NAV, MAIN_COLOR } from '../constants';
import Footer from '../components/Footer';
import CarAvailable from '../components/CarAvailable';
import ValidationList from '../components/ValidationList';
import Steps from '../components/Steps';

class HomeScreen extends Component {
  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(this._fetchCarsAssign);
    this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this._onBackPress);

    this.props.setActiveScreen(HOME_NAV);
  }

  componentWillUnmount() {
    this.backHandlerListener.remove();
  }

  _onBackPress = () => {
    this.props.setActiveScreen(HOME_NAV);
    return true;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.user.type === 'manager' ? <ValidationList /> : <CarAvailable />}     
        <Footer />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps, { setActiveScreen })(HomeScreen);
