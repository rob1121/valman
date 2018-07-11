import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store/index';
import {MAIN_COLOR, RAMP_ADD_CAR_NAV} from './constants';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RampAddCarScreen from './screens/RampAddCarScreen';
import CarAvailableScreen from './screens/CarAvailableScreen';
import ValidationHistoryListScreen from './screens/ValidationHistoryListScreen';

export default class App extends Component {

  render() {
    
    const navOption = {
      header: null,
      gesturesEnabled: false,
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

      CarAvailable: {
        screen: CarAvailableScreen,
        navigationOptions: { ...navOption, headerLeft: null }
      },

      ValidationHistoryList: {
        screen: ValidationHistoryListScreen,
        navigationOptions: { ...navOption, headerLeft: null }
      },
    });
  
    return (
      <Provider store={store} >
          <MainNavigation />
      </Provider>
    );
  }
}