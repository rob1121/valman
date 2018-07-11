import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Picker from '../Picker'
import {setCarInfo} from '../../actions';

class  Option extends Component {
  render() {
    const options = [
      { key: 'delivery', label: 'DELIVERY' },
      { key: 'pickup', label: 'PICKUP' }
    ];

    return (
      <View style={{marginLeft: 10}}>
        <Picker value={this.props.car.opt} options={options} onValueChange={opt => this.props.setCarInfo({opt})} />
      </View>
    );
  }
}

const mapStateToProps =({car}) => ({car});

export default connect(mapStateToProps, {setCarInfo})(Option);