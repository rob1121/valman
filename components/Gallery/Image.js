import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

class Image extends React.Component{
  render() {
    const {onPress, uri} = this.props;
    return (
        <TouchableOpacity activeOpacity = { .5 } onPress={onPress}>
          <ImageBackground 
            source={{uri}} 
            style={{
              margin:5, 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 50,
              width: 50
              }} 
          />
      </TouchableOpacity>
    );
  }
}
export default Image;