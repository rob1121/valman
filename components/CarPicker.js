import React, {Component} from 'react';
import {View} from 'react-native';
import axios from 'axios';
import { map, toUpper } from 'lodash';
import {CAR_LIST_URL} from '../constants';
import Picker from './Picker';

export default class CarPicker extends Component {

  state = {options: []}

  componentDidMount() {
    axios.get(CAR_LIST_URL)
      .then(this._setOption)
      .catch(this._errHandler)
    ;
  }

  _setOption = ({data}) => {
    const options = map(data, (item, index) => {
      return {
        key: item.model,
        label: toUpper(`${item.make}|${item.model}`),
      };
    });
    this.setState(() => ({...this.state, options}));
  }
  
  _errHandler = error   => console.error(error);

  render() {
    const {value, onValueChange} = this.props;
    const {options} = this.state;

    return <Picker value={value} options={options} onValueChange={onValueChange} />;
  }
}