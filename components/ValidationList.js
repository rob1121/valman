import React, {Component} from 'react';
import {RefreshControl, ScrollView, Alert, View, Text} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {Header, ListItem, List } from 'react-native-elements';
import {uniqBy, filter, toUpper, isEmpty, map} from 'lodash';
import {setValidationActiveTask, setValidationList} from '../actions';
import {VALIDATION_LIST_URL} from '../constants';
import ValidationActiveTask from './ValidationActiveTask';
import Picker from './Picker';

class ValidationList extends Component {
  state = {
    refreshing: false,
    selectedGuest: undefined,
    guestList: [
      {key:'', label:''}
    ]
  }

  componentWillMount() {
    this.props.setValidationList({});
    this._fetchCarForValidation();
  }

  render() {
    const { selectedGuest, guestList } = this.state;
    if(!isEmpty(this.props.validation_list.active_task)) {
      return <ValidationActiveTask />;
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{ text: 'VALIDATION LIST', style: { color: '#fff' } }}
        />
        
        <View style={{marginLeft:15}}>
          <Text>Guest Name</Text>
          <Picker value={selectedGuest} options={guestList} onValueChange={this._setSelectedGuest} />
        </View>

        <ScrollView 
          style={{marginTop: 20, marginBottom: 50}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._fetchCarForValidation}
            />
          }
        >
          {!isEmpty(this.props.validation_list.list) 
            ? this._generateListItem(this.props.validation_list.list)
            : <Text style={{textAlignVertical: "center",textAlign: "center"}}>No Car For Validation</Text>
          }
        </ScrollView>
      </View>
    )
  }

  _setSelectedGuest = selectedGuest => this.setState({ selectedGuest })

  _generateListItem = (list) => {
    const { selectedGuest } = this.state;
    const filteredList = filter(list, (guest) => {
      guest.guest_name = toUpper(guest.guest_name || '');
      return guest.guest_name.includes(toUpper(selectedGuest));
    });
    
    const retVal = map(filteredList, (task, i) => {
      return (<ListItem
        key={i}
        title={`#${task.ticket_number} ${toUpper(task.guest_name || '-')}: ${task.car_plate_no || '-'}`}
        subtitle={
          <View>
            <Text style={{ color: '#848484' }}>Ticket type: {task.type}</Text>
            <Text style={{ color: '#848484' }}>checkout date: {task.ori_checkout_date}</Text>
            <Text style={{ color: '#848484' }}>validation counts left: {this._validationCountDisplay(task.validation_count)}</Text>
          </View>
        }
        leftIcon={{ name: 'directions-car' }}
        onPress={() => this._selectTask(task)}
      />);
    });
    

    return retVal ? (<List>{retVal}</List>) : (<Text>No guest for validation foud!.</Text>);
  }

  _selectTask = task => this.props.setValidationActiveTask(task)

  _fetchCarForValidation = () => {
    this.setState({ ...this.state, refreshing: true});

    axios
      .post(VALIDATION_LIST_URL, {hotel_name: this.props.user.hotel_name})
      .then(this._refreshValidationList)
      .catch(this._errHandler)
    ;
  }

  _errHandler = (error) => console.log(error)

  _refreshValidationList = ({data}) => {
    const refreshing = false;
    const guestList = map(
      data, (guest) => (
        { 
          key: toUpper(guest.guest_name || ''), 
          label: toUpper(guest.guest_name || '') 
        }
      )
    );

    this.props.setValidationActiveTask(null);
    this.props.setValidationList(data);
    this.setState({
      ...this.state,
      refreshing,
      guestList: uniqBy(guestList, 'key')
    });
  }

  _validationCountDisplay = (validation_count = -1) => {
    const INITIAL_VALIDATION_COUNT = -1;
    return validation_count == INITIAL_VALIDATION_COUNT ? 'NOT YET VALIDATED' : validation_count;
  }
}

stateToProps = ({validation_list, user}) => ({validation_list, user});

export default connect(stateToProps, {setValidationActiveTask, setValidationList})(ValidationList);