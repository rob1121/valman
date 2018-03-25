import React, {Component} from 'react';
import {Platform, PickerIOS, Picker, TextInput, Alert, View, ScrollView, Text} from 'react-native';
import {Button, Header, List, ListItem, Icon} from 'react-native-elements';
import axios from 'axios';
import {connect} from 'react-redux';
import {toUpper} from 'lodash';
import {setValidationActiveTask} from '../actions';
import {UPDATE_VALIDATION_TASK_URL, MAIN_COLOR, HOME_NAV} from '../constants';

class ValidationActiveTask extends Component {
  state = {
    loading: false
  }

  render() {
    const {active_task} = this.props.validation_list;
    return (
      <View style={{ flex: 1 }}>
      <Header
          leftComponent={<Icon name='md-arrow-round-back' type='ionicon' color='#fff' onPress={() => this.props.setValidationActiveTask(null)} />}
          centerComponent={{ text: active_task.ticket_number || '-', style: { color: '#fff' } }}
        />
      
      <ScrollView keyboardShouldPersistTaps={'handled'}
        style={{ marginTop: 20}}
      >
        <List containerStyle={{marginBottom: 20}}>
          <ListItem
            hideChevron
            title={active_task.ticket_number || '-'}
            subtitle='TICKET NO.'
          />
          
          <ListItem
            hideChevron
            title={active_task.guest_name || '-'}
            subtitle='GUEST NAME'
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
            subtitle='IS VALID'
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
          title='UPDATE STATUS'
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
        selectedValue={this.props.validation_list.active_task.validated}
        onValueChange={(itemValue) => this.props.setValidationActiveTask({validated: itemValue})}>
        <PickerIOS.Item label='NO' value='0' />
        <PickerIOS.Item label='YES' value='1' />
      </PickerIOS>
    )
  }

  _androidPicker() {
    return (
      <Picker
        selectedValue={this.props.validation_list.active_task.validated}
        onValueChange={(itemValue) => this.props.setValidationActiveTask({validated: itemValue})}>
        <Picker.Item label='NO' value='0' />
        <Picker.Item label='YES' value='1' />
      </Picker>
    )
  }

  _updateTask() {
    Alert.alert(
      'Task Confirmation',
      'Click ok to confirm action?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.setState({loading: true});
          axios.post(UPDATE_VALIDATION_TASK_URL, this.props.validation_list.active_task)
          .then(({data}) => {
            console.log(data);

            this.setState({loading: false});
            this.props.setValidationActiveTask(null);
            this.props.nav.navigate(HOME_NAV);
          })
          .catch((error) => console.log(error));
        }},
      ]
    );
  }
}

const stateToProps = ({validation_list, nav}) => ({validation_list, nav});

export default connect(stateToProps, {setValidationActiveTask})(ValidationActiveTask);