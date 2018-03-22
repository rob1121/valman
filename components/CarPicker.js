import React, {Component} from 'react';
import {TouchableHighlight, Picker, Modal, PickerIOS, View, Platform} from 'react-native';
import {Text, Button, FormInput} from 'react-native-elements';
import axios from 'axios';
import {map, toUpper} from 'lodash';
import {CAR_LIST_URL, MAIN_COLOR} from '../constants';

export default class CarPicker extends Component {
  state = {
    cars: {},
    showModal: false,
  }

  componentDidMount() {
    axios.get(CAR_LIST_URL)
    .then(({data}) => {
      this.setState(() => ({cars: data}))
    }).catch((error) => console.log(error));
  }

  render() {
    return (
      <View>
        {Platform.OS === 'ios' 
        ? <TouchableHighlight 
        onPress={() => this.setState({...this.state, showModal: true})}>
        <Text
        textStyle={{size: 24}}>{toUpper(this.props.value)}(click to edit)</Text>
           </TouchableHighlight>
        : this._pickerAndroid()}
        {Platform.OS === 'ios' && this._pickerIOS()}
      </View>
    );
  }

  _pickerAndroid() {
    return (
      <Picker
        selectedValue={this.props.value}
        onValueChange={(itemValue) => this.props.onValueChange(itemValue)}>
        <Picker.Item label='N/A' value='' />
        {map(this.state.cars, (item, index) => {
          return <Picker.Item key={index} label={toUpper(`${item.make}|${item.model}`)} value={item.model} />
        })}
      </Picker>
    );
  }

  _pickerIOS() {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.showModal}
        onRequestClose={() => {
          this.setState(() => ({ ...this.state, showModal: false }))
        }}>
        <View style={{ flex: 1}}>
          <PickerIOS
            selectedValue={this.props.value}
            onValueChange={(itemValue) => this.props.onValueChange(itemValue)}>
            <PickerIOS.Item label='N/A' value='' />
            {map(this.state.cars, (item, index) => {
              return <PickerIOS.Item key={index} label={toUpper(`${item.make}|${item.model}`)} value={item.model} />
            })}
          </PickerIOS>

          <Button
            backgroundColor={MAIN_COLOR}
            title='DONE'
            onPress={() => this.setState(() => ({ ...this.state, showModal: false }))}
          />
        </View>
      </Modal>
    );
  }
}