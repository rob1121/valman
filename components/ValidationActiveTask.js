import React, {Component} from 'react';
import {Platform, PickerIOS, Picker, TextInput, Alert, View, ScrollView, Text} from 'react-native';
import {Button, Header, List, ListItem, Icon} from 'react-native-elements';
import axios from 'axios';
import {connect} from 'react-redux';
import {toUpper} from 'lodash';
import Barcode from 'react-native-barcode-builder';
import {setValidationActiveTask} from '../actions';
import {UPDATE_VALIDATION_TASK_URL, MAIN_COLOR, HOME_NAV} from '../constants';

class ValidationActiveTask extends Component {
  constructor() {
    super();
    this._androidPicker = this._androidPicker.bind(this);
    this._iosPicker = this._iosPicker.bind(this);
    this._onBackBtnPress = this._onBackBtnPress.bind(this);
    this._onPickerChangeVal = this._onPickerChangeVal.bind(this);
    this._onUpdateTaskConfirm = this._onUpdateTaskConfirm.bind(this);
    this._processUpdateTaskResponse = this._processUpdateTaskResponse.bind(this);
    this._updateTask = this._updateTask.bind(this);
  }
  state = {
    loading: false
  }

  render() {
    const {active_task} = this.props.validation_list;
    return (
      <View style={{ flex: 1 }}>
      <Header
        leftComponent={<Icon name='md-arrow-round-back' type='ionicon' color='#fff' onPress={this._onBackBtnPress} />}
        centerComponent={{ text: active_task.ticket_number || '-', style: { color: '#fff' } }}
      />
      
      <ScrollView keyboardShouldPersistTaps={'handled'}
        style={{ marginTop: 20}}
      >
        <List containerStyle={{marginBottom: 20}}>
          <ListItem
            hideChevron
            title={
              <View>
                <Text style={{textAlignVertical: "center",textAlign: "center"}}>{active_task.ticket_number || '-'}</Text>
                {active_task.ticket_number && <Barcode value={active_task.ticket_number}  format="CODE128" />}
              </View>
            }
          />
          
          <ListItem
            hideChevron
            title={active_task.guest_name || '-'}
            subtitle='GUEST NAME'
          />
          
          <ListItem
            hideChevron
            title={active_task.room_number || '-'}
            subtitle='ROOM NO.'
          />
          
          <ListItem
            hideChevron
            title={active_task.checkin_date}
            subtitle='CHECKIN DATE'
          />
          
          <ListItem
            hideChevron
            title={active_task.checkout_date || '-'}
            subtitle='CHECKOUT DATE'
          />
          
          <ListItem
            hideChevron
            title={toUpper(active_task.car_plate_no) || '-'}
            subtitle='CAR PLATE NO'
          />
          
          <ListItem
            hideChevron
            title={Platform.OS == 'ios' ? this._iosPicker() : this._androidPicker()}
            subtitle='TYPE'
          />
          
          <ListItem
            hideChevron
            title={<TextInput
                multiline={true}
                numberOfLines={4}
                underlineColorAndroid='transparent'
                style={{ padding: 5, height: 100, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(text) => this.props.setValidationActiveTask({ comment: text })}
                value={active_task.comment} />}
            subtitle='COMMENT'
          />
        </List>
        <Button
          loading={this.state.loading}
          buttonStyle={{backgroundColor: MAIN_COLOR}}
          title='VALIDATED'
          onPress={() => this._updateTask()}
          />
        <View style={{ height: 200}}  />
        </ScrollView>
      </View>
    );
  }

  _iosPicker() {
    return (
      <PickerIOS
        selectedValue={this.props.validation_list.active_task.type}
        onValueChange={this._onPickerChangeVal}>
        <PickerIOS.Item label='VALIDATION' value='validation' />
        <PickerIOS.Item label='EXECUTIVE COMP' value='executive comp' />
      </PickerIOS>
    )
  }

  _androidPicker() {
    return (
      <Picker
        selectedValue={this.props.validation_list.active_task.type}
        onValueChange={this._onPickerChangeVal}>
        <Picker.Item label='VALIDATION' value='validation' />
        <Picker.Item label='EXECUTIVE COMP' value='executive comp' />
      </Picker>
    )
  }

  _onBackBtnPress() {
    this.props.setValidationActiveTask(null)
  }

  _updateTask() {
    Alert.alert(
      'Task Confirmation',
      'Click ok to confirm action?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: this._onUpdateTaskConfirm},
      ]
    );
  }

  _onPickerChangeVal(itemValue) {
    this.props.setValidationActiveTask({type: itemValue})
  }

  _onUpdateTaskConfirm() {
    this.setState({loading: true});
    axios.post(
      UPDATE_VALIDATION_TASK_URL, 
      this.props.validation_list.active_task
    )
      .then(this._processUpdateTaskResponse)
      .catch((error) => console.log(error))
    ;
  }

  _processUpdateTaskResponse({data}) {
    console.log(data);

    this.setState({loading: false});
    this.props.setValidationActiveTask(null);
    this.props.nav.navigate(HOME_NAV);
  }
}

const stateToProps = ({validation_list, nav}) => ({validation_list, nav});

export default connect(stateToProps, {setValidationActiveTask})(ValidationActiveTask);