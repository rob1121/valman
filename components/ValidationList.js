import React, {Component} from 'react';
import {Alert, View, Text} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {ListItem, List } from 'react-native-elements';
import {isEmpty, map} from 'lodash';
import {setValidationActiveTask, setValidationList} from '../action';
import {VALIDATION_LIST_URL} from '../constants';
import ValidationActiveTask from './ValidationActiveTask';

class ValidationList extends Component {
  componentWillMount() {
    axios.post(VALIDATION_LIST_URL)
    .then(({data}) => {
      this.props.setValidationActiveTask({});
      this.props.setValidationList(data);
    }).catch((error) => console.log(error));
  }
  return () {
    if(!isEmpty(this.props.validation_list.active_task)) {
      return <ValidationActiveTask />;
    }

    return (
      <View>
        {!isEmpty(this.props.validation_list.list) && <List>
          {map(this.props.validation_list.list, (task) => {
            return (<ListItem
              key={i}
              title={`${toUpper(task.requestor)}: ${task.opt}`}
              subtitle={`#${task.ticketno} ${task.status_title}`}
              leftIcon={{ name: 'directions-car', ...iconStyle }}
              onPress={() => this._selectTask(task)}
            />);
          })}
        </List>}
        {isEmpty(this.props.validation_list.list) && <Text>No Car For Validation</Text>}
      </View>
    )
  }

  _selectTask(task) {
    this.props.setValidationActiveTask(task);
  }
}

stateToProps = ({validation_list}) => ({validation_list});

export default connect(stateToProps, {setValidationActiveTask, setValidationList})(ValidationList);