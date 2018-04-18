import React, {Component} from 'react';
import { View} from 'react-native';
import {Text, FormLabel, FormInput, Icon, FormValidationMessage, Button}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has, toUpper} from 'lodash';
import axios from 'axios';
import {WIN_WIDTH, MAIN_COLOR, SEARCH_TICKET_URL} from '../constants';
import {setCarInfo} from '../actions';
import Barcode from './Barcode';
import Option from './RampForm/Option';
import CarDetailsInput from './RampForm/CarDetailsInput';
import Comment from './RampForm/Comment';
import SubmitBtn from './RampForm/SubmitBtn';
import CheckOutDate from './CheckOutDate';

class Hotel extends Component {
  state = {
    hasValidTicket: false,
    loading: false,
    showDatePicker: false,
    chosenDate: new Date(),
  }

  componentWillMount() {
    this.props.setCarInfo({ name: this.props.selected_location });
  }

  render() {
    const {setCarInfo, car, error} = this.props;

    return (
      <View>
        <FormLabel>HOTEL NAME</FormLabel>
        <View style={{ margin: 15 }}>
          <Text style={{marginLeft: 5}}>{toUpper(car.name)}</Text>
        </View>
        <FormValidationMessage>{has(error, 'name') && error.name}</FormValidationMessage>
        <Barcode />
        {this.state.hasValidTicket  && <FormValidationMessage>{has(error, 'ticketno') && error.ticketno}</FormValidationMessage>}
        {
          this.state.hasValidTicket 
          ? this._hotelForm()
          : <Button 
            loading={this.state.loading} 
            backgroundColor={MAIN_COLOR} 
            icon={{name: 'search'}} 
            title='SEARCH' 
            onPress={this._searchTicket} />
        }
      </View>
    );
  }

  _searchTicket = () => {
    this.setState(() => ({loading: true}));
    axios.post(SEARCH_TICKET_URL, {hotel: this.props.car.name, ticketno: this.props.car.ticketno}).then(({data}) => {
      let hasValidTicket = false;
      if(data.error) {
        alert(data.msg);
      } else {
        hasValidTicket = true;
        data.data && this.props.setCarInfo(data.data);
      }
      this.setState(() => ({ ...this.state, loading: false, hasValidTicket }));
    }).catch((error) => {
      this.setState(() => ({ loading: false }));
      console.log(error);
    });
  }

  _hotelForm() {
    const {setCarInfo, car, error} = this.props;
    
    return (
      <View>
        
        <FormLabel>OPTION</FormLabel>
        <Option />
        <FormValidationMessage>{has(error,'opt') && error.opt}</FormValidationMessage>
        
        <FormLabel>GUEST NAME</FormLabel>
        <FormInput onChangeText={guest_name => setCarInfo({guest_name})} value={car.guest_name} />
          <FormValidationMessage>{has(error,'guest_name') && error.guest_name}</FormValidationMessage>

        <FormLabel>FOLIO NUMBER</FormLabel>
        <FormInput onChangeText={folio_number => setCarInfo({folio_number})} value={car.folio_number} />
          <FormValidationMessage>{has(error,'folio_number') && error.folio_number}</FormValidationMessage>

        <FormLabel>ROOM NUMBER</FormLabel>
        <FormInput onChangeText={room_number => setCarInfo({room_number})} value={car.room_number} />
          <FormValidationMessage>{has(error,'room_number') && error.room_number}</FormValidationMessage>

        <FormLabel>CHECKOUT DATE</FormLabel>
        <CheckOutDate date={this.props.car.checkout_date} onDateChange={(checkout_date) => setCarInfo({ checkout_date })} />
        
        <FormValidationMessage>{has(error,'checkout_date') && error.checkout_date}</FormValidationMessage>
        <CarDetailsInput />
        <Comment />
        <SubmitBtn />
      </View>
    )
  }
}

const mapStateToProps = ({ car, error, selected_location }) => ({ car, error, selected_location });

export default connect(mapStateToProps, { setCarInfo})(Hotel);