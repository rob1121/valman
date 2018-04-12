import React, {Component} from 'react';
import {TouchableOpacity, View, Platform} from 'react-native';
import {Text, Button, FormInput} from 'react-native-elements';
import axios from 'axios';
import { map, toUpper, findIndex} from 'lodash';
import ModalFilterPicker from 'react-native-modal-filter-picker'
import {CAR_LIST_URL, MAIN_COLOR} from '../constants';

export default class CarPicker extends Component {
  state = {
    cars: {},
    showModal: false,
    visible: false,
  }

  componentDidMount() {
    axios.get(CAR_LIST_URL)
    .then(({data}) => {
      this.setState(() => ({cars: data}))
    }).catch((error) => console.log(error));
  }

  render() {
    const { visible } = this.state;

    const options = map(this.state.cars, (item, index) => {
      return {
        key: item.model,
        label: toUpper(`${item.make}|${item.model}`),
      };
    });

    const selected = findIndex(options, (option) => option.key == this.props.value);

    return (
      <View style={{marginLeft: 10}}>
        <TouchableOpacity onPress={this.onShow}>
          <Text textStyle={{ size: 24 }}>{toUpper(selected == -1 ? 'N/A' : options[selected].label)}</Text>
        </TouchableOpacity>
        {/* this opensource ModalFilterPicker been modified
        included onrequestclose function */}
        <ModalFilterPicker
          visible={visible}
          onSelect={this.onSelect}
          onCancel={this.onCancel}
          options={options}
        />
      </View>
    );
  }

  onShow = () => {
    this.setState({ visible: true });
  }

  onSelect = (picked) => {
    this.props.onValueChange(picked);
    this.setState({
      visible: false
    })
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
  }
}