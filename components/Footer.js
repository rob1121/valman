import React, {Component} from 'react';
import {Alert, AsyncStorage} from 'react-native';
import {Icon, Header} from 'react-native-elements';
import {connect} from 'react-redux';
import axios from 'axios';
import {logoutUser} from '../actions';
import {
  ACTIVE_SCREEN_COLOR,
  NOT_ACTIVE_SCREEN_COLOR,
  DISABLE_SCREEN_COLOR,
  HOME_NAV,
  LOGIN_NAV,
  RAMP_ADD_CAR_NAV,
  ACTIVE_TASK_LIST_NAV,
  VALIDATION_HISTORY_LIST_NAV,
  LOGOUT_URL
} from '../constants';

class Footer extends Component {
  _logout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: this._resetUser},
      ],
      { cancelable: false }
    );
  }

  _resetUser = () => {
    const {token} = this.props.user;
    axios.post(LOGOUT_URL, {token}).then(() => {
      AsyncStorage.multiRemove(['username','password']);
      this.props.logoutUser();
      this.props.nav.navigate(LOGIN_NAV);
    }).catch((error) => console.log(error));
  }

  _screenMenuColor = name => {
    return this.props.nav.active_screen === name ? ACTIVE_SCREEN_COLOR : NOT_ACTIVE_SCREEN_COLOR;
  }

  _screenMenuOnPress = name => {
    return this.props.nav.active_screen !== name ? (() => this.props.nav.navigate(name)) : null;
  }

  render() {
    const {nav, user} = this.props;
    const {ic, oc} = styles;
    
    return (
      <Header
        outerContainerStyles={oc}
        innerContainerStyles={ic}
      >
        <Icon 
          name='home' 
          type='material-community' 
          color={this._screenMenuColor(HOME_NAV)}
          onPress={this._screenMenuOnPress(HOME_NAV)}
        />

        {this.props.user.type === 'manager'
          ? <Icon
            name='tasklist'
            type='octicon'
            color={this._screenMenuColor(VALIDATION_HISTORY_LIST_NAV)}
            onPress={this._screenMenuOnPress(VALIDATION_HISTORY_LIST_NAV)}
          /> : null
        }

        {this.props.user.type === 'ramp'
          ? <Icon
            name='tasklist'
            type='octicon'
            color={this._screenMenuColor(ACTIVE_TASK_LIST_NAV)}
            onPress={this._screenMenuOnPress(ACTIVE_TASK_LIST_NAV)}
          /> : null
        }

        {this.props.user.type === 'ramp'  
          ? <Icon 
            name='barcode-scan' 
            type='material-community' 
            color={this._screenMenuColor(RAMP_ADD_CAR_NAV)}
            onPress={this._screenMenuOnPress(RAMP_ADD_CAR_NAV)}
          /> : null
        }

        <Icon 
          name='sign-out' 
          type='font-awesome' 
          color={NOT_ACTIVE_SCREEN_COLOR}
          onPress={this._logout}
        />

      </Header>
    );
  }
}

const styles = {
  ic: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oc: {
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
    height: 50,
    backgroundColor: '#f7f7f7',
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
  }
}

const mapStateToProps = ({ nav, user }) => ({ nav, user });

export default connect(mapStateToProps, {logoutUser})(Footer);
