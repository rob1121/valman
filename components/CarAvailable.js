import React, { Component } from 'react';
import { Notifications } from 'expo';
import {  View, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, List, ListItem, Header, FormLabel } from 'react-native-elements';
import axios from 'axios';
import { toUpper, toLower, filter, isEmpty, map } from 'lodash';
import {LOCATION_FILTER_URL, PARKING_STATUS_UPDATE_URL, CAR_ASSIGN_URL} from '../constants';
import {assignCars, updateActiveCar, hasActiveCar} from '../actions';
import { connect } from 'react-redux';
import RampLocation from '../components/RampLocation';
import Steps from '../components/Steps';

class CarAvailable extends Component {
  state = {
    refreshing: false,
    pageLoading: true,
  }

  componentWillMount() {
    this.setState(() => ({ ...this.state, pageLoading: true}));
    this._notificationSubscription = Notifications.addListener(this._fetchCarsAssign);
    this.props.updateActiveCar({});
    this.props.hasActiveCar(false);
    this.props.assignCars(undefined);
    this._fetchCarsAssign();
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

  _fetchCarsAssign = () => {
    this.setState({ ...this.state, refreshing: true});
    axios.post(CAR_ASSIGN_URL, this.props.user)
      .then(this._updateCarList)
      .catch(this._errHandler)
    ;
  }

  _updateCarList = ({ data }) => {
    this.props.updateActiveCar(data.active_task);
    this.props.hasActiveCar(data.has_active_task);
    this.props.assignCars(data.task_list);
    this.setState(() => ({ ...this.state, refreshing: false, pageLoading: false }));
}

  _updateStatus = task => {
    this.setState({ ...this.state, refreshing: true });
    const {user} = this.props;
    axios.post(PARKING_STATUS_UPDATE_URL, {task, user})
      .then(this._setCars)
      .catch(this._errHandler)
    ;
  }

  _setCars = ({ data }) => {
    this.props.updateActiveCar(data.data.active_task);
    this.props.hasActiveCar(data.data.has_active_task);
    this.props.assignCars(data.data.task_list);
    this.setState({ ...this.state, refreshing: false });
  }
  
  _errHandler = error   => console.error(error);

  _listItem(carsAssign) {
    const listItems = map(carsAssign, (task, i) => {

      const iconStyle = task.is_late_checkout ? {style: {color: 'red'}} : {};
      return (<ListItem
        key={i}
        title={`${toUpper(task.requestor)}: ${toUpper(task.opt)}`}
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
    const header = (
      <Header
        centerComponent={{ text: 'TASK LIST FOR YOU', style: { color: '#fff' } }}
      />
    );

    if(car_assign.task_list == undefined || this.state.pageLoading) {
      return (
        <View style={{ flex: 1 }}>
            {header}
            <Text style={emptyTaskContainer}>Loading...</Text>
        </View>
      );
    }

    return car_assign.has_active_task ? <Steps /> : (
      <View style={{ flex: 1 }}>
        {header}
        {this._carListComp()}
      </View>
    );
  }

  _carListComp() {
    const { emptyTaskContainer} = styles;
    const { car_assign, user, selected_location} = this.props;
    let carsAssign = car_assign.task_list;
    if(this.props.user.type == 'ramp') {
      carsAssign = filter(car_assign.task_list, (task) => {
        task.requestor = toLower(task.requestor || '');
        return task.requestor.includes(toLower(selected_location));
      });
    }

    return (
      <ScrollView
        style={{ marginTop: 20, marginBottom: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._fetchCarsAssign}
          />
        }
      >
        {this.props.user.type == 'ramp' && <FormLabel>HOTEL NAME</FormLabel>}
        {this.props.user.type == 'ramp' && <RampLocation />}
        {!isEmpty(carsAssign)
          ? this._listItem(carsAssign)
          : <Text style={emptyTaskContainer}>No record found!.</Text>}
      </ScrollView>
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

export default connect(mapStateToProps, {assignCars, updateActiveCar, hasActiveCar})(CarAvailable)