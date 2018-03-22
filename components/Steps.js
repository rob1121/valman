import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Image, View, Alert, ScrollView, TextInput} from 'react-native';
import axios from 'axios';
import {toUpper} from 'lodash';
import { Header, Button, Icon, FormInput, FormLabel, List, ListItem, Text} from 'react-native-elements';
import Barcode from 'react-native-barcode-builder';
import { assignCars, updateActiveCar} from '../actions';
import { DEFAULT_IMG, MAIN_COLOR, PARKING_STATUS_UPDATE_URL, WAITING_DISPATCHER, CAMERA_NAV } from '../constants';
import CarPicker from './CarPicker';
import CameraAction from '../components/Camera';

class Steps extends Component 
{
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
            title={(active_task.status_id == 2 || active_task.status_id == 4) 
              ? <CarPicker 
                  value={active_task.car_model} 
                  onValueChange={(val) => this.props.updateActiveCar({car_model: val})} 
                />
              : (active_task.car_model ? (`${active_task.car_make} | ${active_task.car_model}`) : '-')}
            subtitle='CAR MAKE/MODEL.'
          />
          
          <ListItem
            hideChevron
            title={(active_task.status_id == 2 || active_task.status_id == 4) 
              ? <TextInput
                underlineColorAndroid='#000'
                style={{padding: 5, marginTop: 10}}
                onChangeText={(text) => this.props.updateActiveCar({ car_plate_no: text })}
                value={active_task.car_plate_no} />
              : (toUpper(active_task.car_plate_no) || '-')}
            subtitle='CAR PLATE NO'
          />
          
          <ListItem
            hideChevron
            title={(active_task.status_id == 2 || active_task.status_id == 4) 
              ? <TextInput
                multiline={true}
                numberOfLines={4}
                underlineColorAndroid='transparent'
                style={{ padding: 5, height: 100, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(text) => this.props.updateActiveCar({ comment: text })}
                value={active_task.comment} />
              : (active_task.comment || '-')}
            subtitle='COMMENT'
          />
        </List>
          
        <CameraAction />
        <Button
          loading={this.state.loading}
          buttonStyle={{backgroundColor: MAIN_COLOR}}
          title='UPDATE STATUS'
          onPress={() => this._confirm()}
          />
        <View style={{ height: 200}}  />
        </ScrollView>
      </View>
    );
  }

  _confirm() {
    Alert.alert(
      'Task Confirmation',
      'Are you sure you have completed this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this._updateStatus()},
      ]
    );
  }

  _updateStatus() {
    this.setState(() => ({loading: true}));
    axios.post(PARKING_STATUS_UPDATE_URL, {
     task: this.props.car_assign.active_task,
     user: this.props.user,
    })
    .then(({data}) => {
      this.setState(() => ({loading: false}));
      
      if(data.error) {
        alert(data.msg);
      } else {
        this.props.assignCars(data.data);
      }
    }).catch((error) => {
      console.log(error);
      this.setState(() => ({loading: false}));
    });
  }
}
const mapStateToProps = ({ user, car_assign, nav }) => ({ user, car_assign, nav });

export default connect(mapStateToProps, { assignCars, updateActiveCar})(Steps);
