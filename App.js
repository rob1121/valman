import React, { Component } from 'react';
import { BackHandler} from 'react-native';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store/index';
import {MAIN_COLOR, RAMP_ADD_CAR_NAV} from './constants';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RampAddCarScreen from './screens/RampAddCarScreen';
import ActiveTaskListScreen from './screens/ActiveTaskListScreen';

export default class App extends Component {

  render() {
    
    const navOption = {
      header: null,
    };

    const navOptionWithHeader = (title) => ({
      title: title,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: MAIN_COLOR}
    });
    
    const MainNavigation = StackNavigator({
      Login: { 
        screen: LoginScreen, 
        navigationOptions: navOption,
      },
      Home: {
        screen: HomeScreen,
        navigationOptions: { ...navOption, headerLeft: null}
      },

      RampAddCar: {
        screen: RampAddCarScreen,
        navigationOptions: { ...navOption, headerLeft: null}
      },

      ActiveTaskList: {
        screen: ActiveTaskListScreen,
        navigationOptions: { ...navOption, headerLeft: null}
      },
    });
  
    return (
      <Provider store={store} >
          <MainNavigation />
      </Provider>
    );
  }
}