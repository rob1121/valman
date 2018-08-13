import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text, FormValidationMessage, FormLabel, FormInput}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has, toUpper} from 'lodash';
import axios from 'axios';
import { setCarInfo } from '../actions';
import { SEARCH_TICKET_URL, MAIN_COLOR } from '../constants';
import Option from './RampForm/Option';
import Picker from './Picker';
import Barcode from './Barcode';
import CarDetailsInput from './RampForm/CarDetailsInput';
import Comment from './RampForm/Comment';
import SubmitBtn from './RampForm/SubmitBtn';
import CheckOutDate from './CheckOutDate';

class Transient extends Component {
  state = {
    hasValidTicket: false,
    loading: false,
    paymentMethodOptions: [
      {key: 'cash', label: 'CASH'},
      {key: 'credit', label: 'CREDIT'}
    ]
  }

  componentWillMount = () => this.props.setCarInfo({ name: this.props.selected_location });

  render() {
    const { setCarInfo, car, error } = this.props;

    return (
      <View>
        <Barcode />
        {this.state.hasValidTicket && <FormValidationMessage>{has(error, 'ticketno') && error.ticketno}</FormValidationMessage>}
        {
          this.state.hasValidTicket
            ? this._transientForm()
            : <Button
              loading={this.state.loading}
              backgroundColor={MAIN_COLOR}
              icon={{ name: 'search' }}
              title='SEARCH'
              onPress={this._searchTicket} />
        }
      </View>
    );
  }

  _transientForm() {
    const { setCarInfo, car, error } = this.props;
    const { paymentMethodOptions } = this.state;

    return (
      <View>
        <FormLabel>OPTION</FormLabel>
        <Option />
        <FormValidationMessage>{has(error, 'opt') && error.opt}</FormValidationMessage>
        
        {car.opt == 'pickup' && <FormLabel>FLOOR NUMBER</FormLabel>}
        {car.opt == 'pickup' && <FormInput onChangeText={floor_number => setCarInfo({floor_number})} value={car.floor_number} />}
        {car.opt == 'pickup' && <FormValidationMessage>{has(error,'floor_number') && error.floor_number}</FormValidationMessage>}

        <FormLabel>HOTEL NAME</FormLabel>
        <View style={{ margin: 15 }}>
          <Text style={{ marginLeft: 5 }}>{toUpper(car.name)}</Text>
        </View>
        <FormValidationMessage>{has(error, 'name') && error.name}</FormValidationMessage>

        <FormLabel>CHECKOUT DATE</FormLabel>
        <View style={{marginLeft: 15}}>
          <CheckOutDate date={this.props.car.checkout_date} onDateChange={checkout_date => setCarInfo({ checkout_date })} />
        </View>
        <FormValidationMessage>{has(error,'checkout_date') && error.checkout_date}</FormValidationMessage>

        <FormLabel>PAYMENT METHOD</FormLabel>
        <View style={{ marginLeft: 10 }}>
          <Picker value={car.payment_method} onValueChange={payment_method => setCarInfo({ payment_method })} options={paymentMethodOptions} />
        </View>
        <FormValidationMessage>{has(error, 'payment_method') && error.payment_method}</FormValidationMessage>


        <FormLabel>CONTACT NO.</FormLabel>
        <FormInput
          inputStyle={{ marginLeft: 5 }}
          onChangeText={contact_no => setCarInfo({ contact_no })}
          value={car.contact_no}
          placeholder='09xxxxxxxxx'
          dataDetectorTypes='phoneNumber'
          keyboardType='phone-pad' />
        <FormValidationMessage>{has(error, 'contact_no') && error.contact_no}</FormValidationMessage>

        <CarDetailsInput />
        <Comment />
        <SubmitBtn />
      </View>
    );
  }

  _searchTicket = () => {
    const params = {
      hotel: this.props.car.name,
      ticketno: this.props.car.ticketno,
      ticket_type: 'transient'
    };

    this.setState(() => ({ loading: true }));
    axios.post(SEARCH_TICKET_URL, params)
      .then(this._getTicketInfo)
      .catch(this._handdleErr)
      ;
  }

  _getTicketInfo = ({ data }) => {
    let hasValidTicket = false;
    if (data.error) {
      alert(data.msg);
    } else {
      hasValidTicket = true;
      data.data && this.props.setCarInfo(data.data);
    }
    this.setState(() => ({ ...this.state, loading: false, hasValidTicket }));
  }

  _handdleErr = (error) => {
    this.setState(() => ({ loading: false }));
    console.log(error);
  }
}

const mapStateToProps = ({ car, error, selected_location }) => ({ car, error, selected_location });

export default connect(mapStateToProps, { setCarInfo})(Transient);