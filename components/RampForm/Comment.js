import React from 'react';
import {View, TextInput} from 'react-native';
import {FormLabel} from 'react-native-elements';
import {connect} from 'react-redux';
import {setCarInfo} from '../../actions';

const Comment = (props) => (
  <View>
    <FormLabel>COMMENT </FormLabel>
    <TextInput
      multiline={true}
      numberOfLines={4}
      underlineColorAndroid='transparent'
      style={{ margin: 15, padding: 5, height: 100, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={(text) => props.setCarInfo({ comment: text })}
      value={props.car.comment} />
  </View>
);
            
const mapStateToProps =({car}) => ({car});

export default connect(mapStateToProps, {setCarInfo})(Comment);