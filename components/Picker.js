import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text, Button, FormInput} from 'react-native-elements';
import { toUpper, findIndex} from 'lodash';
import ModalFilterPicker from 'react-native-modal-filter-picker'

export default class Picker extends Component {
  state = {
    visible: false,
  }

  render() {
    const { visible } = this.state;
    const {value, options, onValueChange} = this.props;

    const valIndex = findIndex(options, (option) => option.key == value);

    return (
      <View style={{marginLeft: 10}}>
        <TouchableOpacity onPress={this._onShow}>
          <Text textStyle={{ size: 24 }}>{toUpper(valIndex == -1 ? 'N/A' : options[valIndex].label)}</Text>
        </TouchableOpacity>
        {/* this opensource ModalFilterPicker been modified
        included onrequestclose function */}
        <ModalFilterPicker
          visible={visible}
          onSelect={this._onSelect}
          onCancel={this._onCancel}
          options={options}
        />
      </View>
    );
  }

  _onSelect = picked => {
    this.props.onValueChange(picked);
    this.setState({visible: false})
  }
  
  _onShow = () => this.setState({ visible: true })

  _onCancel = () =>this.setState({visible: false})
}