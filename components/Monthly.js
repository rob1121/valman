import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, FormValidationMessage, FormLabel, FormInput, Button}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has, toUpper} from 'lodash';
import axios from 'axios';
import {FETCH_MONTHLY_GUEST_URL, SEARCH_MONTHLY_USER_URL, MAIN_COLOR} from '../constants';
import {setCarInfo} from '../actions';
import Option from './RampForm/Option';
import CarDetailsInput from './RampForm/CarDetailsInput';
import Comment from './RampForm/Comment';
import SubmitBtn from './RampForm/SubmitBtn';
import Picker from '../components/Picker';

class Monthly extends Component {
  state = {
    hasValidUser: false,
    loading: false,
    monthly_guest: {},
  }

  componentWillMount() {
    this.props.setCarInfo({ name: this.props.selected_location });
    
    axios.post(FETCH_MONTHLY_GUEST_URL)
    .then(({data}) => {
      this.setState(() => ({ ...this.state, monthly_guest: data }));
    }).catch((error) => {
      this.setState(() => ({ loading: false }));
      console.log(error);
    });
  }

  render() {
    const {setCarInfo, car, error} = this.props;
    const {monthly_guest, hasValidUser, loading} = this.state;
    //TODO: monthly guest option
    monthlyGuestOption
    return (
      <View>
      <FormLabel>NAME</FormLabel>
      <View style={{marginLeft:10}}>
        <Picker value={car.name} options={monthlyGuestOption} onValueChange={this._onTicketTypeChange} />
      </ View>

        <FormLabel>CONTACT NO.</FormLabel>
        <FormInput 
        onChangeText={(val) => setCarInfo({ contact_no: val })} 
        value={car.contact_no} 
        placeholder='09xxxxxxxxx'
        dataDetectorTypes='phoneNumber'
        keyboardType='phone-pad' />
        <FormValidationMessage>{has(error, 'contact_no') && error.contact_no}</FormValidationMessage>
        {
          (hasValidUser == true && loading == false)
            ? this._monthlyForm()
            : <Button 
            loading={loading} 
            backgroundColor={MAIN_COLOR} 
            icon={{name: 'search'}} 
            title='SEARCH'  
            onPress={() => this._searchUser()} />
        }
      </View>
    );
  }

  _searchUser() {
    this.setState(() => ({loading: true}));
    axios.post(SEARCH_MONTHLY_USER_URL, {
      contact_no: this.props.car.contact_no, 
      location: this.props.selected_location,
    }).then(({data}) => {
      let hasValidUser = false;
      if(data.error) {
        alert(data.msg);
      } else {
        hasValidUser = true;
        this.props.setCarInfo(data.data);
      }
      this.setState(() => ({ ...this.state, loading: false, hasValidUser }));
    }).catch((error) => {
      this.setState(() => ({ loading: false }));
      console.log(error);
    });
  }

  _monthlyForm() {
    const {setCarInfo, car, error} = this.props;
    return (
      <View>
        <FormLabel>OPTION</FormLabel>
        <Option />
        <FormValidationMessage>{has(error,'opt') && error.opt}</FormValidationMessage>
        
        <FormLabel>HOTEL NAME</FormLabel>
        <View style={{ margin: 15 }}>
          <Text>{toUpper(car.name)}</Text>
        </View>

        <CarDetailsInput />
        <Comment />
        <SubmitBtn />
      </View>

    )
  }
}

const mapStateToProps = ({ car, error, selected_location }) => ({ car, error, selected_location });

export default connect(mapStateToProps, { setCarInfo})(Monthly);