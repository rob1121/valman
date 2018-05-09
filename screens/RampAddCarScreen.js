import React, {Component} from 'react';
import { View, ScrollView, BackHandler} from 'react-native';
import {Header, FormLabel}  from 'react-native-elements';
import {connect} from 'react-redux';
import { RAMP_ADD_CAR_NAV, HOME_NAV} from '../constants';
import {setErrors, resetCarInfo, setActiveScreen, setCarInfo} from '../actions';
import Hotel from '../components/Hotel';
import Transient from '../components/Transient';
import Monthly from '../components/Monthly';
import Footer from '../components/Footer';
import Picker from '../components/Picker';

class RampAddCar extends Component {
  state = {
    options: [
      {label:'TRANSIENT', key:'transient'},
      {label:'HOTEL', key:'hotel'},
      {label:'MONTHLY', key:'monthly'},
    ],
    ticketTypeComp: {
      hotel: <Hotel />,
      transient: <Transient />,
      monthly: <Monthly />
    }
  }

  componentWillMount () {
    this.backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress', 
      () => {
        if(this.props.nav.active_screen != HOME_NAV) {
          this.props.setActiveScreen(HOME_NAV);
          this.props.nav.navigate(HOME_NAV);

          return true;
        }

        return false;
      }
    );

    this.props.setCarInfo({uid: this.props.user.id});
    this.props.setActiveScreen(RAMP_ADD_CAR_NAV);
  }

  componentWillUnmount () {
    this.backHandlerListener.remove();
  }

  render() {
    const {car} = this.props;
    const {options, ticketTypeComp} = this.state;

    return (
      <View style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          
        <Header
          centerComponent={{ text: 'TICKETING', style: { color: '#fff' } }}
        />
          <FormLabel>TICKET TYPE</FormLabel>
          <View style={{marginLeft:10}}>
          <Picker value={car.ticket_type} options={options} onValueChange={this._onTicketTypeChange} />
          </ View>
          {ticketTypeComp[car.ticket_type]}
        </ScrollView>
        <Footer />
      </View>
    );
  }

  _onTicketTypeChange = ticket_type => {
    this.props.resetCarInfo({name: this.props.car.name});
    this.props.setErrors({});
    this.props.setCarInfo({ ticket_type, uid: this.props.user.id });
  }
}

const mapStateToProps = ({ car, user, nav }) => ({ car, user, nav });

export default connect(mapStateToProps, { setErrors, resetCarInfo, setCarInfo, setActiveScreen })(RampAddCar);