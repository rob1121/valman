import React, { Component } from 'react';
import { RefreshControl, ScrollView, Alert, View, Text } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { Header, ListItem, List } from 'react-native-elements';
import { toUpper, isEmpty, map } from 'lodash';
import { setActiveScreen, setValidationActiveTask, setValidationList } from '../actions';
import { VALIDATION_HISTORY_LIST_URL, VALIDATION_HISTORY_LIST_NAV } from '../constants';
import Footer from '../components/Footer';
import ValidationHistorySelected from '../components/ValidationHistorySelected';

class ValidationHistoryList extends Component {
  state = {
    refreshing: false,
  }

  componentWillMount() {
    this.props.setValidationList({});
    this._fetchValidationHistory();
    this.props.setActiveScreen(VALIDATION_HISTORY_LIST_NAV);
  }

  render() {
    if (!isEmpty(this.props.validation_list.active_task)) {
      return <ValidationHistorySelected />;
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{ text: 'VALIDATION HISTORY', style: { color: '#fff' } }}
        />
        <ScrollView
          style={{ marginTop: 20, marginBottom: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._fetchValidationHistory}
            />
          }
        >
          {!isEmpty(this.props.validation_list.list)
            ? <List>{map(this.props.validation_list.list, this._generateListItem)}</List>
            : <Text style={{ textAlignVertical: "center", textAlign: "center" }}>No History</Text>
          }
        </ScrollView>
        <Footer />
      </View>
    )
  }

  _generateListItem = (task, i) => {
    return (<ListItem
      key={i}
      title={`#${task.ticket_number} ${toUpper(task.guest_name || '-')}: ${task.car_plate_no || '-'}`}
      subtitle={
        <View>
          <Text style={{ color: '#848484' }}>checkout date: {task.ori_checkout_date}</Text>
          <Text style={{ color: '#848484' }}>validated at: {task.created_at}</Text>

        </View>
      }
      leftIcon={{ name: 'directions-car' }}
      onPress={() => this._selectTask(task)}
    />);
  }

  _selectTask = task => this.props.setValidationActiveTask(task)

  _fetchValidationHistory = () => {
    this.setState({ ...this.state, refreshing: true });

    axios
      .post(VALIDATION_HISTORY_LIST_URL, { hotel_name: this.props.user.hotel_name })
      .then(this._refreshValidationList)
      .catch(this._errHandler)
      ;
  }

  _errHandler = (error) => console.log(error)

  _refreshValidationList = ({ data }) => {
    this.props.setValidationActiveTask(null);
    this.props.setValidationList(data);
    this.setState({ ...this.state, refreshing: false });
  }
}

stateToProps = ({ validation_list, user }) => ({ validation_list, user });

export default connect(stateToProps, { setValidationActiveTask, setValidationList, setActiveScreen })(ValidationHistoryList);