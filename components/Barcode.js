import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo';
import {connect} from 'react-redux';
import {Icon, FormInput, FormLabel} from 'react-native-elements';
import {setCarInfo} from '../actions';
import { WIN_WIDTH} from '../constants';

class Barcode extends React.Component {
  state = {
    showBarcode: false,
  }

  render() {
    return (    
      <View>
        <FormLabel>
          TICKET NO.
        </FormLabel>

        <View style={{ flexDirection: 'row', width: WIN_WIDTH }}>
          <View style={{ width: WIN_WIDTH*0.8 }}>
            <FormInput onChangeText={(val) => this.props.setCarInfo({ticketno: val})} value={this.props.car.ticketno} keyboardType='numeric' />
          </View>

          <View style={{ width: WIN_WIDTH * 0.2 }}>
          <Icon
            iconStyle={{marginTop: 10 }}
            name='barcode-scan'
            type='material-community'
            onPress={() => this.setState({...this.state, showBarcode: true})}
            />
          </View>

          {this.state.showBarcode && <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.viewImg}
            onRequestClose={() => this.setState({...this.state, showBarcode: false})}>
          <View style={{flex: 1}}>
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </Modal>}
        </View>
      </View>
      );
  }

  _handleBarCodeRead = ({ type, data }) => {
    this.props.setCarInfo({ticketno: data});
    this.setState(() => ({...this.state, showBarcode: false}));
  }
}

const mapStateToProps = ({ car }) => ({ car });

export default connect(mapStateToProps, {setCarInfo})(Barcode)