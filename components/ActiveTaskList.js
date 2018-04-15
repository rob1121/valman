import React, {Component} from 'react';
import {View, ScrollView, RefreshControl, Text} from 'react-native';
import {List, ListItem, Header} from 'react-native-elements';
import {connect} from 'react-redux';
import axios from 'axios';

class ActiveTaskList extends Component {
  constructor() {
    super();
    this._fetchActiveTaskList = this._fetchActiveTaskList.bind(this);
    this._generateListItem = this._generateListItem.bind(this);
    this._refreshValidationList = this._refreshValidationList.bind(this);
  }

  state = {
    refreshing: false,
  }

  componentWillMount = this._fetchActiveTaskList

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{ text: 'ACTIVE TASK LIST', style: { color: '#fff' } }}
        />
        <ScrollView
          style={{ marginTop: 20, marginBottom: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._fetchActiveTaskList}
            />
          }
        >
          {!isEmpty(this.props.active_task_list.task_list)
            ? <List>{map(this.props.active_task_list.task_list, this._generateListItem)}</List>
            : <Text style={{ textAlignVertical: "center", textAlign: "center" }}>No Car For Validation</Text>
          }
        </ScrollView>
      </View>
    )
  }

  _generateListItem() {

  }

  _fetchActiveTaskList() {
    this.setState({ ...this.state, refreshing: true });

    axios
      .post(VALIDATION_LIST_URL, { base: this.props.user.base })
      .then(this._refreshValidationList)
      .catch((error) => console.log(error))
    ;
  }

  _refreshValidationList({ data }) {
    this.props.setValidationActiveTask(null);
    this.props.setValidationList(data);
    this.setState({ ...this.state, refreshing: false });
  }
}

const mapStateToProps = ({ active_task_list, user }) => ({ active_task_list, user });
export default connect(mapStateToProps)(ActiveTaskList)
