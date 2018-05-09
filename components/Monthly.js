import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, FormValidationMessage, FormLabel, FormInput, Button}  from 'react-native-elements';
import {connect} from 'react-redux';
import {has, toUpper, map, findIndex} from 'lodash';
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
    showMonthlyForm: false,
    monthly_guest: [],
    selectedNameOption: 'option'
  }

  componentWillMount() {
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
    const monthlyGuestOption = map(monthly_guest, (guest) => ({
      key: guest.guest_name,
      label: guest.guest_name,
    }));

    return (
      <View>
        <FormLabel>GUEST NAME</FormLabel>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <View style={{flex: 1}}>
            {this.state.selectedNameOption == 'option'
              ? <View style={{ marginLeft: 10 }}>
                  <Picker value={car.guest_name} options={monthlyGuestOption} onValueChange={this._onGuestNameChange} />
              </View>
              : <FormInput onChangeText={guest_name => setCarInfo({ guest_name })} value={car.guest_name}/>
            }
          </View>
          <Button
            backgroundColor={MAIN_COLOR}
            title={this.state.selectedNameOption == 'option' ? 'manual input' : 'selections'}
            onPress={() => {
              setCarInfo({ guest_name: '' })
              this.setState({ 
                ...this.state, 
                showMonthlyForm: true, 
                selectedNameOption: (this.state.selectedNameOption == 'option' ? 'manual' : 'option')
              })
            }}
            />
        </View>
        <FormValidationMessage>{has(error,'guest_name') && error.guest_name}</FormValidationMessage>
        {this.state.showMonthlyForm ? this._monthlyForm() : null }
      </View>
    );
  }

  _onGuestNameChange = guestName => {
    const INVALID_INDEX = -1;
    const index = findIndex(this.state.monthly_guest, {guest_name: guestName});

    if (index > INVALID_INDEX)
      this.props.setCarInfo(this.state.monthly_guest[index]);

    this.setState({showMonthlyForm: true});
  }

  _monthlyForm() {
    const {setCarInfo, car, error} = this.props;
    return (
      <View>

        <FormLabel>CONTACT NO.</FormLabel>
        <FormInput
          onChangeText={contact_no => setCarInfo({ contact_no })}
          value={car.contact_no}
          placeholder='09xxxxxxxxx'
          dataDetectorTypes='phoneNumber'
          keyboardType='phone-pad' />
          
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