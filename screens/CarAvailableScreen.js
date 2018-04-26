import React, { Component } from 'react';
import {View} from 'react-native';
import CarAvailable from '../components/CarAvailable';
import {CAR_AVAILABLE_LIST_NAV} from '../constants';
import {setActiveScreen} from '../actions';
import {connect} from 'react-redux';

class CarAvailableScreen extends Component {
  componentWillMount() {
    this.props.setActiveScreen(CAR_AVAILABLE_LIST_NAV);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <CarAvailable />
      </View>
      );
  }
}
export default connect(null, {setActiveScreen})(CarAvailableScreen);