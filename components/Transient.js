import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, FormValidationMessage, FormLabel, FormInput}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has, toUpper} from 'lodash';
import axios from 'axios';
import {setCarInfo} from '../actions';
import Option from './RampForm/Option';
import Picker from './Picker';
import Barcode from './Barcode';
import CarDetailsInput from './RampForm/CarDetailsInput';
import Comment from './RampForm/Comment';
import SubmitBtn from './RampForm/SubmitBtn';
import CheckOutDate from './CheckOutDate';

class Transient extends Component {
  state = {
    paymentMethodOptions: [
      {key: 'cash', label: 'CASH'},
      {key: 'credit', label: 'CREDIT'}
    ]
  }

  componentWillMount = () => this.props.setCarInfo({ name: this.props.selected_location });

  render() {
    const {setCarInfo, car, error} = this.props;
    const {paymentMethodOptions} = this.state;

    return (
      <View>
        <FormLabel>OPTION</FormLabel>
        <Option />
        <FormValidationMessage>{has(error,'opt') && error.opt}</FormValidationMessage>

        <Barcode />
        <FormValidationMessage>{has(error, 'ticketno') && error.ticketno}</FormValidationMessage>
        
        <FormLabel>HOTEL NAME</FormLabel>
        <View style={{margin: 15}}>
          <Text  style={{marginLeft: 5}}>{toUpper(car.name)}</Text>
        </View>
        <FormValidationMessage>{has(error, 'name') && error.name}</FormValidationMessage>

        <FormLabel>CHECKOUT DATE</FormLabel>
        <CheckOutDate date={this.props.car.checkout_date} onDateChange={checkout_date => setCarInfo({ checkout_date })} />

        <FormLabel>PAYMENT METHOD</FormLabel>
        <View style={{marginLeft: 10}}>
          <Picker value={car.payment_method} onValueChange={payment_method => setCarInfo({payment_method})} options={paymentMethodOptions} />
        </View>


        <FormLabel>CONTACT NO.</FormLabel>
        <FormInput 
          inputStyle={{marginLeft: 5}}
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
}

const mapStateToProps = ({ car, error, selected_location }) => ({ car, error, selected_location });

export default connect(mapStateToProps, { setCarInfo})(Transient);