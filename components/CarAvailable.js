import React, { Component } from 'react';
import {  View, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, List, ListItem, Header, FormLabel } from 'react-native-elements';
import axios from 'axios';
import { toUpper, toLower, filter, isEmpty, map } from 'lodash';
import {PARKING_STATUS_UPDATE_URL, CAR_ASSIGN_URL} from '../constants';
import {assignCars, setSelectedLocation} from '../actions';
import { connect } from 'react-redux';
import RampLocation from '../components/RampLocation';

class CarAvailable extends Component 
{
  state = {
    refreshing: false,
  }

  _selectTask(task) {
    Alert.alert(
      'Task Confirmation',
      'Are you sure you want to proceed to this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this._updateStatus(task)},
      ]
    );
  }

  _fetchCarsAssign() {
    this.setState({ ...this.state, refreshing: true});
    axios.post(CAR_ASSIGN_URL, this.props.user).then(({ data }) => {
      this.props.assignCars(data);
      this.setState({ ...this.state, refreshing: false});
    }).catch((error) => { console.error(error); });
  }

  _updateStatus(task) {
    const {user} = this.props;
    axios.post(PARKING_STATUS_UPDATE_URL, {task, user}).then(({data}) => {
      this.props.assignCars(data.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  _listItem(carsAssign) {
    const listItems = map(carsAssign, (task, i) => {

      const iconStyle = task.is_late_checkout ? {style: {color: 'red'}} : {};
      return (<ListItem
        key={i}
        title={`${toUpper(task.requestor)}: ${task.opt}`}
        subtitle={`#${task.ticketno} ${task.status_title}`}
        leftIcon={{ name: 'directions-car', ...iconStyle }}
        onPress={() => this._selectTask(task)}
      />);
    });

    return (<List containerStyle={styles.listContainerStyle}>
      {listItems}
    </List>);
  }

  render() {
    const { emptyTaskContainer} = styles;
    const { car_assign, nav, user, selected_location} = this.props;
    let carsAssign = car_assign.task_list;
    // if(this.props.user.type == 'ramp') {
    //   carsAssign = filter(car_assign.task_list, (task) => {
    //     task.requestor = toLower(task.requestor || '');
    //     return task.requestor.includes(toLower(selected_location));
    //   });
    // }
    return (
      <View style={{flex: 1}}>
        <Header
          centerComponent={{ text: 'TASK LIST', style: { color: '#fff' } }}
        />
        <ScrollView 
          style={{marginTop: 20, marginBottom: 50}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._fetchCarsAssign()}
            />
          }
        >
          {this.props.user.type == 'ramp' && <FormLabel>HOTEL NAME</FormLabel>}
          {this.props.user.type == 'ramp' && <View style={{ margin: 20 }}>
            <RampLocation value={this.props.selected_location} setSelectedLocation={(val) => this.props.setSelectedLocation(val)} />
          </View>}
          {!isEmpty(carsAssign) 
            ? this._listItem(carsAssign) 
            : <Text style={emptyTaskContainer}>No record found!.</Text>}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  listContainerStyle: { 
    marginTop: 0, 
    marginBottom: 20 
  },

  emptyTaskContainer: { 
    marginTop: 20, 
    color: '#000', 
    textAlign: 'center' 
  },
};

const mapStateToProps = ({ user, nav, car_assign, selected_location }) => ({ user, nav, car_assign, selected_location });

export default connect(mapStateToProps, {assignCars, setSelectedLocation})(CarAvailable)