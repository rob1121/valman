import React, {Component} from 'react';
import {RefreshControl, ScrollView, Alert, View, Text} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {Header, ListItem, List } from 'react-native-elements';
import {toUpper, isEmpty, map} from 'lodash';
import {setValidationActiveTask, setValidationList} from '../actions';
import {VALIDATION_LIST_URL} from '../constants';
import ValidationActiveTask from './ValidationActiveTask';

class ValidationList extends Component {
  state = {
    refreshing: false,
  }

  componentWillMount() {
    this.props.setValidationList({});
    this._fetchCarForValidation();
  }

  render() {
    if(!isEmpty(this.props.validation_list.active_task)) {
      return <ValidationActiveTask />;
    }

    return (
      <View style={{flex: 1}}>
        <Header
          centerComponent={{ text: 'VALIDATION LIST', style: { color: '#fff' } }}
        />
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
            ? <List>{map(this.props.validation_list.list, this._generateListItem)}</List>
            : <Text style={{textAlignVertical: "center",textAlign: "center"}}>No Car For Validation</Text>
          }
        </ScrollView>
      </View>
    )
  }

  _generateListItem = (task, i) => {
    return (<ListItem
      key={i}
      title={`#${task.ticket_number} ${toUpper(task.guest_name || '-')}: ${task.car_plate_no || '-'}`}
      subtitle={
        <View>
          <Text style={{color: '#848484'}}>checkout date: {task.ori_checkout_date}</Text>
          <Text style={{color: '#848484'}}>validations left: {this._validationCountDisplay(task.validation_count)}</Text>
          
        </View>
      }
      leftIcon={{ name: 'directions-car' }}
      onPress={() => this._selectTask(task)}
    />);
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
    this.props.setValidationActiveTask(null);
    this.props.setValidationList(data);
    this.setState({ ...this.state, refreshing: false});
  }

  _validationCountDisplay = (validation_count = -1) => {
    const INITIAL_VALIDATION_COUNT = -1;
    return validation_count == INITIAL_VALIDATION_COUNT ? 'NOT YET VALIDATED' : validation_count;
  }
}

stateToProps = ({validation_list, user}) => ({validation_list, user});

export default connect(stateToProps, {setValidationActiveTask, setValidationList})(ValidationList);