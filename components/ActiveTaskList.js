import React, { Component } from 'react';
import { ScrollView, RefreshControl, View, Text } from 'react-native';
import { FormLabel, Header, List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { isEmpty, toUpper, map, filter, toLower } from 'lodash';
import axios from 'axios';
import { setActiveScreen, setActiveTaskList } from '../actions';
import {errorHandler} from '../utilities';
import { HOME_NAV, ACTIVE_TASK_LIST_URL } from '../constants';
import RampLocation from './RampLocation';
import Footer from './Footer';
import ActiveTaskListSelected from './ActiveTaskListSelected';

class ActiveTaskList extends Component {
  state = {
    refreshing: false,
    hasSelectedTask: false,
    selectedTask: {},
  }

  componentWillMount() {
    this._fetchActiveTaskList();
    this.props.setActiveScreen(HOME_NAV);
  }
  _fetchActiveTaskList = () => {
    this.setState(() => ({ refreshing: true }));
    axios.post(ACTIVE_TASK_LIST_URL, { base: this.props.user.base })
      .then(this._updateActiveTaskList)
      .catch(errorHandler)
      ;
  }

  _updateActiveTaskList = ({ data }) => {
    this.props.setActiveTaskList(data);

    this.setState(() => ({ refreshing: false }));
  }

  _listItem = () => {
    const { selected_location, active_task_list } = this.props;
    const activeTasks = filter(active_task_list, (task) => {
      task.requestor = toLower(task.requestor || '');
      return task.requestor.includes(toLower(selected_location));
    });

    if (isEmpty(activeTasks)) return <Text style={{ textAlignVertical: "center", textAlign: "center" }}>No Active task found!</Text>

    const items = map(activeTasks, (task, i) => {
      return (
        <ListItem
          key={i}
          title={`${toUpper(task.car_make || '-')}|${toUpper(task.car_model || '-')} ${task.car_plate_no || '-'} ${task.active ? 'IN PROGRESS' : ''}`}
          subtitle={
            <View>
              <Text>#{task.ticket_number} || driver: {task.driver || '-'}</Text>
              <Text>task: {task.opt || '-'} || status: {task.status_title || '-'}</Text>
            </View>
          }
          leftIcon={{ name: 'directions-car' }}
          onPress={() => this._selectTask(task)}
        />
      );
    });

    return (
      <List>{items}</List>
    );
  }

  _selectTask = task => this.setState(() => ({ selectedTask: task, hasSelectedTask: true }))

  render() {
    if (this.state.hasSelectedTask) {
      return (
        <ActiveTaskListSelected
          onBackPress={() => this.setState(() => ({ selectedTask: {}, hasSelectedTask: false }))}
          selectedTask={this.state.selectedTask}
        />
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{ text: 'ACTIVE TICKETS', style: { color: '#fff' } }}
        />

        <FormLabel>HOTEL NAME</FormLabel>
        <RampLocation />
        <ScrollView
          style={{ marginTop: 20, marginBottom: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._fetchActiveTaskList}
            />
          }
        >
          {this.props.active_task_list ? this._listItem() : <Text style={styles.emptyTaskContainer}>No record found!.</Text>}
        </ScrollView>
        <Footer />
      </View>
    );
  }
}


const styles = {
  emptyTaskContainer: {
    marginTop: 20,
    color: '#000',
    textAlign: 'center'
  },
};


const mapStateToProps = ({ user, active_task_list, selected_location }) => ({ user, active_task_list, selected_location });

export default connect(mapStateToProps, { setActiveScreen, setActiveTaskList })(ActiveTaskList);
