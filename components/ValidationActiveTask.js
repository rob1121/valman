import React, {Component} from 'react';
import {Alert, View, ScrollView, Text} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import axios from 'axios';
import {setValidationActiveTask} from '../actions';
import {UPDATE_VALIDATION_TASK_URL} from '../constants';
import {connect} from 'react-redux';

class ValidationActiveTask extends Component {
  render() {
    const {active_task} = this.props.validation_task;
    return (
      <View style={{ flex: 1 }}>
      <ScrollView
        style={{ marginTop: 20}}
      >
        <List> containerStyle={{marginBottom: 20}}>
          <ListItem
            hideChevron
            title={active_task.ticketno || '-'}
            subtitle='TICKET NO.'
          />
          
          <ListItem
            hideChevron
            title={active_task.requestor || '-'}
            subtitle='REQUESTOR'
          />
          
          <ListItem
            hideChevron
            title={active_task.driver}
            subtitle='DRIVER'
          />
          
          <ListItem
            hideChevron
            title={active_task.car_model ? (`${active_task.car_make} | ${active_task.car_model}`) : '-'}
            subtitle='CAR MAKE/MODEL.'
          />
          
          <ListItem
            hideChevron
            title={toUpper(active_task.car_plate_no) || '-'}
            subtitle='CAR PLATE NO'
          />
          
          <ListItem
            hideChevron
            title={(active_task.status_id == 2 || active_task.status_id == 4) 
              ? <TextInput
                multiline={true}
                numberOfLines={4}
                underlineColorAndroid='transparent'
                style={{ padding: 5, height: 100, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(text) => this.props.updateActiveCar({ comment: text })}
                value={active_task.comment} />
              : (active_task.comment || '-')}
            subtitle='COMMENT'
          />
        </List>
        <Button
          loading={this.state.loading}
          buttonStyle={{backgroundColor: MAIN_COLOR}}
          title='UPDATE STATUS'
          onPress={() => this._updateTask()}
          />
        <View style={{ height: 200}}  />
        </ScrollView>
      </View>
    );
  }

  _updateTask() {
    Alert.alert(
      'Task Confirmation',
      'Click ok to confirm action?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => {
          axios.post(UPDATE_VALIDATION_TASK_URL, {
            task: this.props.validation_task.active_task,
          }).then(() => this.props.setValidationActiveTask({}));
        }},
      ]
    );
  }
}

const stateToProps = ({validation_task}) => ({validation_task});

export default connect(stateToProps, {setValidationActiveTask})(ValidationActiveTask);