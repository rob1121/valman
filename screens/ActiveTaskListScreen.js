import React, { Component } from 'react';
import {ScrollView, RefreshControl, View, BackHandler, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import {Header, List, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import {toUpper, map} from 'lodash';
import axios from 'axios';
import {Notifications} from 'expo';
import {setActiveScreen, setActiveTaskList} from '../actions';
import {ACTIVE_TASK_LIST_NAV, MAIN_COLOR, ACTIVE_TASK_LIST_URL} from '../constants';
import Footer from '../components/Footer';
import ActiveTaskListSelected from '../components/ActiveTaskListSelected';

class ActiveTaskListScreen extends Component 
{
  constructor() {
    super();
    this._updateActiveTaskList = this._updateActiveTaskList.bind(this);
    this._fetchActiveTaskList = this._fetchActiveTaskList.bind(this);
    this._listItem = this._listItem.bind(this);
    this._selectTask = this._selectTask.bind(this);
  }


  state ={
    pageLoad: false,
    refreshing: false,
    hasSelectedTask: false,
    selectedTask: {},
  }

  componentWillMount() {
    this._fetchActiveTaskList();
    this.props.setActiveScreen(ACTIVE_TASK_LIST_NAV);
  }

  componentWillUnmount() {
    this.backHandlerListener.remove();
  }

  _fetchActiveTaskList() {
    axios.post(ACTIVE_TASK_LIST_URL, {hotel_name: this.props.user.hotel_name})
      .then(this._updateActiveTaskList)
      .catch(this._errHandler)
    ;
  }

  _updateActiveTaskList({data}) {
    console.log(data);
    this.props.setActiveTaskList(null);
    this.setState(() => ({ pageLoad: true}));
  }

  _errHandler = error => console.log(error);

  _listItem() {
    const items = map(this.props.active_task_list, (task, i) => {
      return (
        <ListItem
          key={i}
          title={`${toUpper(task.car_make)}|${toUpper(task.car_model)}: ${task.car_plate_no} (${task.active ? 'IN PROGRESS' : ''})`}
          subtitle={`#${task.ticket_number} ${task.ori_checkout_date}`}
          leftIcon={{ name: 'directions-car' }}
          onPress={() => this._selectTask(task)}
        />
      );
    });

    return (
      <List>{items}</List>
    );
  }

  _selectTask(task) {
    this.setState(() => ({selectedTask: task, hasSelectedTask: true}));
  }

  render() {
    if(this.state.pageLoad) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={MAIN_COLOR} />
          <Footer />
        </View>
      );
    }

    if(this.state.hasSelectedTask) {
      return (
        <ActiveTaskListSelected 
          onBackPress={() => this.setState(() => ({selectedTask: {}, hasSelectedTask: false}))}
          selectedTask={this.state.selectedTask} 
        />
      )
    }
   
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
              onRefresh={this._fetchActiveTaskList}
            />
          }
        >
          {this.props.active_task_list ? this._listItem() : <Text style={emptyTaskContainer}>No record found!.</Text>}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = ({ user, active_task_list }) => ({ user, active_task_list });

export default connect(mapStateToProps, { setActiveScreen, setActiveTaskList })(ActiveTaskListScreen);
