import React, { Component } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { map, toUpper } from 'lodash';
import Picker from './Picker';
import { connect } from 'react-redux';
import { LOCATION_FILTER_URL } from '../constants';

class LocationFilter extends Component  {

  state = {
    list: [],
    visible: false,
  }

  componentDidMount() {
    this._fetchLocations();
  } 

  _fetchLocations = () => {
    const params = {base: this.props.user.base};

    axios.get(LOCATION_FILTER_URL, {params})
      .then(this._setList)
      .catch(this._errHandler);
  }

  _setList = ({ data }) => {

    const list = map(data, item => ({key: item.value, label: toUpper(item.label) }));
    this.setState(() => ({...this.state, list}));


    if(this.props.value == ''){
      this.props.setSelectedLocation(data[0].value);}
  }

  _errHandler = error   => console.error(error);

  render() {
      
    const { visible, list } = this.state;
    const {value, setSelectedLocation} = this.props;

    return (
      <View style={{marginLeft: 10}}>
        <Picker value={value} options={list} onValueChange={picked => setSelectedLocation(picked)} />
      </View>
    );
  }
}

const mapStateToProps = ({user}) => ({user});

export default connect(mapStateToProps)(LocationFilter);