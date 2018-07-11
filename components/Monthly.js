import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, FormValidationMessage, FormLabel}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has, toUpper, map, findIndex} from 'lodash';
import axios from 'axios';
import {FETCH_MONTHLY_GUEST_URL} from '../constants';
import {setCarInfo} from '../actions';
import Option from './RampForm/Option';
import Comment from './RampForm/Comment';
import SubmitBtn from './RampForm/SubmitBtn';
import Picker from '../components/Picker';

class Monthly extends Component {
  state = {
    monthly_guest: []
  }

  componentWillMount() {
    axios.post(FETCH_MONTHLY_GUEST_URL)
    .then(({data}) => {
      this.setState(() => ({ ...this.state, monthly_guest: data }));
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const {car, error} = this.props;
    const {monthly_guest} = this.state;
    const monthlyGuestOption = map(monthly_guest, (guest) => ({
      key: guest.guest_name,
      label: guest.guest_name,
    }));

    return (
      <View>
        <FormLabel>GUEST NAME</FormLabel>
        <View style={{ marginLeft: 15 }}>
          <Picker value={car.guest_name} options={monthlyGuestOption} onValueChange={this._onGuestNameChange} />
        </View>
        <FormValidationMessage>{has(error,'guest_name') && error.guest_name}</FormValidationMessage>
        
         <FormLabel>CONTACT NO.</FormLabel>
        <View style={{ marginLeft: 20 }}>
          <Text>{car.contact_no || '-'}</Text>
        </View>
          <FormLabel>OPTION</FormLabel>
          <Option />
          <FormValidationMessage>{has(error,'opt') && error.opt}</FormValidationMessage>
          
          <FormLabel>HOTEL NAME</FormLabel>
          <View style={{ marginLeft: 20 }}>
            <Text>{toUpper(car.name) || '-'}</Text>
          </View>
          
          <FormLabel>CAR COLOR</FormLabel>
          <View style={{ marginLeft: 20 }}>
            <Text>{toUpper(car.car_color) || '-'}</Text>
          </View>
      
          <FormLabel>CAR PLATE NO</FormLabel>
          <View style={{ marginLeft: 20 }}>
            <Text>{toUpper(car.car_plate_no) || '-'}</Text>
          </View>
  
          <FormLabel>CAR MAKE&MODEL</FormLabel>
          
          <View style={{ marginLeft: 20 }}>
            <Text>{toUpper(car.car_model) || '-'}</Text>
          </View>
          <Comment />
          <SubmitBtn />
      </View>
    );
  }

  _onGuestNameChange = guestName => {
    const INVALID_INDEX = -1;
    const index = findIndex(this.state.monthly_guest, {guest_name: guestName});

    if (index > INVALID_INDEX)
      this.props.setCarInfo(this.state.monthly_guest[index]);
  }
}

const mapStateToProps = ({ car, error, selected_location }) => ({ car, error, selected_location });

export default connect(mapStateToProps, { setCarInfo})(Monthly);