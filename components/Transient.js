import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, FormValidationMessage, FormLabel, FormInput}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has} from 'lodash';
import axios from 'axios';
import {setCarInfo} from '../actions';
import Option from './RampForm/Option';
import Barcode from './Barcode';
import CarDetailsInput from './RampForm/CarDetailsInput';
import Comment from './RampForm/Comment';
import SubmitBtn from './RampForm/SubmitBtn';

class Transient extends Component {
  componentWillMount() {
    this.props.setCarInfo({ name: this.props.selected_location });
  }
  render() {
    const {setCarInfo, car, error} = this.props;

    return (
      <View>
        <Option />
        <Barcode />
        <FormValidationMessage>{has(error, 'ticketno') && error.ticketno}</FormValidationMessage>
        
        <FormLabel>HOTEL NAME</FormLabel>
        <View style={{margin: 15}}>
          <Text  style={{marginLeft: 5}}>{car.name}</Text>
        </View>
        <FormValidationMessage>{has(error, 'name') && error.name}</FormValidationMessage>

        <FormLabel>CONTACT NO.</FormLabel>
        <FormInput 
          inputStyle={{marginLeft: 5}}
          onChangeText={(val) => setCarInfo({ contact_no: val })} 
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