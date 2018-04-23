import React, { Component } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { map, toUpper } from 'lodash';
import Picker from './Picker';
import { connect } from 'react-redux';

class RampLocation extends Component  {

  state = {
    visible: false,
  }
  render = () => {
    const { visible } = this.state;
    const {value, setSelectedLocation, list} = this.props;

    return (
      <View style={{marginLeft: 10}}>
        <Picker value={value} options={list} onValueChange={picked => setSelectedLocation(picked)} />
      </View>
    );
  }
}

const mapStateToProps = ({user}) => ({user});

export default connect(mapStateToProps)(RampLocation);