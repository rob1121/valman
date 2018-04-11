import React, { Component } from 'react';
import { TouchableHighlight, Modal, View, Picker, PickerIOS, Platform } from 'react-native';
import { Text, Button, FormInput } from 'react-native-elements';
import {MAIN_COLOR} from '../constants';
import axios from 'axios';
import { map, size, toUpper } from 'lodash';
import { connect } from 'react-redux';
import { 
  LOCATION_FILTER_URL,
} from '../constants';

class LocationFilter extends Component 
{
  state = {
    list: {},
    showModal: false,
  }

  componentDidMount() {
    this._fetchLocations();
  }

  _fetchLocations() {
    const params = {
      base: this.props.user.base,
    };

    axios.get(LOCATION_FILTER_URL, {params})
      .then(({ data }) => {
        this.setState(() => ({ list: data}));
        if(this.props.value == '')
          this.props.setSelectedLocation(data[0].value);
      })
      .catch((error)   => {console.error(error);});
  }

  render() {

    return (
      <View>
        {Platform.OS === 'ios' 
        ? <TouchableHighlight 
        onPress={() => this.setState({...this.state, showModal: true})}>
        <Text
        textStyle={{size: 24}}>{toUpper(this.props.value)}(click to edit)</Text>
           </TouchableHighlight>
        : this._pickerAndroid()}
        {Platform.OS === 'ios' && this._pickerIOS()}
      </View>
    );
  }


  _pickerIOS() {
    const { value, setSelectedLocation} = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.showModal}
        onRequestClose={() => this.setState(() => ({ ...this.state, showModal: false }))}>
        <View style={{ flex: 1}}>
		<PickerIOS 
            style={{ margin: 15 }}
            onValueChange={(val) => setSelectedLocation(val)}
            selectedValue={value}
          >
            {
              map(this.state.list, (filter, idx) => {
                return <PickerIOS.Item key={idx} label={filter.label} value={filter.value} />
              })
            }
          </PickerIOS>
          <Button
            backgroundColor={MAIN_COLOR}
            title='DONE'
            onPress={() => this.setState({ ...this.state, showModal: false })}
          />
        </View>
      </Modal>
    );
  }


  _pickerAndroid() {
    const { value, setSelectedLocation} = this.props;
    return (
      <Picker
        onValueChange={(val) => setSelectedLocation(val)}
        selectedValue={value}
      >
        {
          map(this.state.list, (filter, idx) => {
            return <Picker.Item key={idx} label={filter.label} value={filter.value} />
          })
        }
      </Picker>
    );
  }
}

const mapStateToProps = ({user}) => ({user});

export default connect(mapStateToProps)(LocationFilter);