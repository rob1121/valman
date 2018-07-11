import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import {connect} from 'react-redux';
import { setActiveScreen } from '../actions';
import {HOME_NAV } from '../constants';
import Footer from '../components/Footer';
import ActiveTaskList from '../components/ActiveTaskList';
import ValidationList from '../components/ValidationList';
import CarAvailable from '../components/CarAvailable';

class HomeScreen extends Component {
  componentWillMount() {
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
    if (this.props.user.type === 'driver') return <CarAvailable />

    return (
      <View style={{ flex: 1 }}>
        {this.props.user.type === 'manager' ? <ValidationList /> : <ActiveTaskList />}     
        <Footer />
      </View>
    );
  }
}

const mapStateToProps = ({ user, nav }) => ({ user, nav });

export default connect(mapStateToProps, { setActiveScreen })(HomeScreen);
