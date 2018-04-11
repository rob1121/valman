import React, {Component} from 'react';
import {TouchableHighlight, Modal, View, Picker, PickerIOS, Platform} from 'react-native';
import {connect} from 'react-redux';
import {toUpper} from 'lodash';
import {Text, FormLabel, FormInput, Button} from 'react-native-elements';
import {setCarInfo} from '../../actions';
import {MAIN_COLOR} from '../../constants';

class  Option extends Component {
  state = {
    showModal: false,
  }

  render() {
    return (
      <View>
      <FormLabel>OPTION</FormLabel>
        {Platform.OS === 'ios' 
        ? <TouchableHighlight 
        onPress={() => this.setState({...this.state, showModal: true})}>
        <Text
        textStyle={{size: 24}}>{toUpper(this.props.car.opt)}(click to edit)</Text>
           </TouchableHighlight>
        : this._pickerAndroid()}
        {Platform.OS === 'ios' && this._pickerIOS()}
      </View>
    )
  }

  _pickerIOS() {
	  
	  
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.showModal}
        onRequestClose={() => this.setState(() => ({ ...this.state, showModal: false }))}>
        <View style={{ flex: 1}}>
          <PickerIOS
            style={{ margin: 15 }}
            selectedValue={this.props.car.opt}
            onValueChange={(val) => this.props.setCarInfo({ opt: val })}>
            <PickerIOS.Item label="DELIVERY" value="Delivery" />
            <PickerIOS.Item label="PICKUP" value="Pickup" />
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

  _pickerAndroid() {
    return (
      <Picker
        style={{ margin: 15 }}
        selectedValue={this.props.car.opt}
        onValueChange={(val) => this.props.setCarInfo({ opt: val })}>
        <Picker.Item label="DELIVERY" value="Delivery" />
        <Picker.Item label="PICKUP" value="Pickup" />
      </Picker>
    );
  }
} 

const mapStateToProps =({car}) => ({car});

export default connect(mapStateToProps, {setCarInfo})(Option);