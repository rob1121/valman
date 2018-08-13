import React, {Component} from 'react';
import {connect} from 'react-redux';
import { View, Alert, ScrollView, TextInput} from 'react-native';
import axios from 'axios';
import {toLower, toUpper, isEmpty} from 'lodash';
import { Header, Button, List, ListItem, Text} from 'react-native-elements';
import Barcode from 'react-native-barcode-builder';
import { hasActiveCar, assignCars, updateActiveCar} from '../actions';
import { 
  MAIN_COLOR, 
  PARKING_STATUS_UPDATE_URL, 
  ARRIVED_AT_THE_GARAGE,
  VEHICLE_ON_THE_WAY, 
  WAITING_DISPATCHER, 
  VALET_ON_THE_WAY 
} from '../constants';
import CarPicker from './CarPicker';
import Gallery from './Gallery';

class Steps extends Component {
  state = {
    loading: false,
  }

  render() {
    const {active_task} = this.props.car_assign;
    if(active_task.status_id === WAITING_DISPATCHER) {
      return (
        <View style={{ flex: 1 }}>
          <Header
            centerComponent={{ text: toUpper(active_task.status_title), style: { color: '#fff' } }}
          />
          {active_task.ticketno != '' && <Barcode value={active_task.ticketno} format="CODE128" />}

          {active_task.ticketno != '' && <Text style={{ textAlign: 'center' }} h5>{active_task.ticketno}</Text>}
          <View style={{ flex: 1 }}>
            <Text style={{textAlign: 'center', marginTop: 50, marginBottom: 10 }} h5> Waiting for Dispatcher Acknowledgement. </Text>
            <Text style={{textAlign: 'center', marginTop: 10, marginBottom: 10 }}> To complete this please have your dispatcher acknowlege your arrival at the garage </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>

        <ScrollView
          style={{ marginTop: 20}}
        >
        <Header
          centerComponent={{ text: toUpper(active_task.status_title), style: { color: '#fff' } }}
        />

        {active_task.ticketno != '' && <Barcode value={active_task.ticketno} format="CODE128" />}
        <List containerStyle={{marginBottom: 20}}>
          <ListItem
            hideChevron
            title={active_task.ticketno || '-'}
            subtitle='TICKET NO.'
          />

          {active_task.ticket_type == 'hotel' && <ListItem
            hideChevron
            title={active_task.guest_name || '-'}
            subtitle='GUEST NAME'
          />}

          {active_task.ticket_type == 'hotel' && <ListItem
            hideChevron
            title={active_task.room_number || '-'}
            subtitle='ROOM NUMBER'
          />}

          <ListItem
            hideChevron
            title={active_task.requestor || '-'}
            subtitle='REQUESTOR'
          />
          
          <ListItem
            hideChevron
            title={active_task.driver}
            subtitle='DRIVER'
          />
          
          <ListItem
            hideChevron
            title={(active_task.status_id == VALET_ON_THE_WAY || active_task.status_id == VEHICLE_ON_THE_WAY) 
              ? <CarPicker 
                  value={active_task.car_model} 
                  onValueChange={car_model => this.props.updateActiveCar({car_model})}
                />
              : (active_task.car_model ? (`${active_task.car_make} | ${active_task.car_model}`) : '-')}
            subtitle='CAR MAKE/MODEL.'
          />

          <ListItem
            hideChevron
            title={(active_task.status_id == VALET_ON_THE_WAY || active_task.status_id == VEHICLE_ON_THE_WAY)
              ? <TextInput
                underlineColorAndroid='#000'
                style={{ padding: 5, marginTop: 10 }}
                onChangeText={car_plate_no => this.props.updateActiveCar({car_plate_no})}
                value={active_task.car_plate_no} />
              : (toUpper(active_task.car_plate_no) || '-')}
            subtitle='CAR PLATE NO'
          />

          <ListItem
            hideChevron
            title={(active_task.status_id == VALET_ON_THE_WAY || active_task.status_id == VEHICLE_ON_THE_WAY)
              ? <TextInput
                underlineColorAndroid='#000'
                style={{ padding: 5, marginTop: 10 }}
                onChangeText={car_color => this.props.updateActiveCar({car_color})}
                value={active_task.car_color} />
              : (toUpper(active_task.car_color) || '-')}
            subtitle='CAR COLOR'
          />

          <ListItem
            hideChevron
            title={(toLower(active_task.opt) == 'pickup')
              ? <TextInput
                underlineColorAndroid='#000'
                style={{ padding: 5, marginTop: 10 }}
                onChangeText={floor_number => this.props.updateActiveCar({floor_number})}
                value={active_task.floor_number} />
              : (toUpper(active_task.floor_number) || '-')}
            subtitle='FLOOR NUMBER'
          />
          
          <ListItem
            hideChevron
            title={(active_task.status_id == VALET_ON_THE_WAY || active_task.status_id == VEHICLE_ON_THE_WAY) 
              ? <TextInput
                multiline={true}
                numberOfLines={4}
                underlineColorAndroid='transparent'
                style={{ padding: 5, height: 100, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={comment => this.props.updateActiveCar({comment})}
                value={active_task.comment} />
              : (active_task.comment || '-')}
            subtitle='COMMENT'
          />
        </List>
          
        <Gallery />
        <Button
          loading={this.state.loading}
          buttonStyle={{backgroundColor: MAIN_COLOR}}
          title='UPDATE STATUS'
          onPress={this._confirm}
          />
        <View style={{ height: 200}}  />
        </ScrollView>
      </View>
    );
  }

  _confirm = () => {
    Alert.alert(
      'Task Confirmation',
      'Are you sure you have completed this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: this._updateStatus},
      ]
    );
  }

  _updateStatus = () => {
    if(this.props.car_assign.active_task.status_id == ARRIVED_AT_THE_GARAGE && 
       isEmpty(this.props.car_assign.active_task.floor_number)) {
      alert('Floor number is required');
      return;
    }
    const params = {
      task: this.props.car_assign.active_task,
      user: this.props.user,
    };
    
    this.setState(() => ({loading: true}));
    axios.post(PARKING_STATUS_UPDATE_URL, params)
      .then(this._updateCarList)
      .catch(this._errHandler)
    ;
  }

  _updateCarList = ({ data }) => {
    this.setState(() => ({ loading: false }));
    
    if (data.error) {
      alert(data.msg);
      return;
    }
    this.props.updateActiveCar(data.data.active_task);
    this.props.hasActiveCar(data.data.has_active_task);
    this.props.assignCars(data.data.task_list);
  }

  _errHandler = error => {
    console.log(error);
    this.setState(() => ({ loading: false }));
  }
}

const mapStateToProps = ({ user, car_assign, nav }) => ({ user, car_assign, nav });
export default connect(mapStateToProps, { hasActiveCar, assignCars, updateActiveCar})(Steps);
