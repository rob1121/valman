import React, { Component } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { map, toUpper } from 'lodash';
import Picker from './Picker';
import { LOCATION_FILTER_URL } from '../constants';
import { setSelectedLocation } from '../actions';
import { connect } from 'react-redux';

class RampLocation extends Component  {

  state = {
    list: [],
    visible: false,
  }

  componentDidMount() {
    this._fetchLocations();
  }

  _fetchLocations = () => {
    const params = { base: this.props.user.base };

    axios.get(LOCATION_FILTER_URL, { params })
      .then(this._setLocationList)
      .catch(this._errHandler)
    ;
  }

  _setLocationList = ({ data }) => {
    const list = map(data, item => ({ key: item.value, label: toUpper(item.label) }));
    this.setState(() => ({ ...this.state, list }));
    if (this.props.selected_location == '') {
      this.props.setSelectedLocation(data[0].value);
    }
  }
  
  render = () => {
    const { visible, list } = this.state;
    const { setSelectedLocation, selected_location} = this.props;

    return (
      <View style={{marginLeft: 10}}>
        <Picker value={selected_location} options={list} onValueChange={picked => setSelectedLocation(picked)} />
      </View>
    );
  }
}

const mapStateToProps = ({user, selected_location}) => ({user, selected_location});

export default connect(mapStateToProps, { setSelectedLocation })(RampLocation);