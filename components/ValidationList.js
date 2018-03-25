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
              onRefresh={() => this._fetchCarForValidation()}
            />
          }
        >
        {!isEmpty(this.props.validation_list.list) && <List>
          {map(this.props.validation_list.list, (task, i) => {
            
            return (<ListItem
              key={i}
              title={`${toUpper(task.guest_name)}: ${task.car_plate_no}`}
              subtitle={`#${task.ticket_number} ${task.ori_checkout_date}`}
              leftIcon={{ name: 'directions-car' }}
              onPress={() => this._selectTask(task)}
            />);
          })}
        </List>}
        {isEmpty(this.props.validation_list.list) && <Text style={{justifyContent:'center'}}>No Car For Validation</Text>}
        </ScrollView>
      </View>
    )
  }

  _selectTask(task) {
    this.props.setValidationActiveTask(task);
  }

  _fetchCarForValidation() {
    this.setState({ ...this.state, refreshing: true});

    axios.post(VALIDATION_LIST_URL, {
      hotel_name: this.props.user.hotel_name
    })
    .then(({data}) => {
      this.props.setValidationActiveTask(null);
      this.props.setValidationList(data);
      this.setState({ ...this.state, refreshing: false});
    }).catch((error) => console.log(error));
  }
}

stateToProps = ({validation_list, user}) => ({validation_list, user});

export default connect(stateToProps, {setValidationActiveTask, setValidationList})(ValidationList);