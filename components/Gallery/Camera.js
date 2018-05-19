import React from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import Exponent, { ImagePicker, Permissions } from 'expo';
import {connect} from 'react-redux';
import {setImages} from '../../actions';
import { IMG_API_URL } from '../../constants';



class Camera extends React.Component {
  state = {
    uploading: false
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
  }


  render() {
    return this.state.uploading ? <ActivityIndicator size="small" color="#00ff00" /> : <Icon name='camera' type='entypo' color='#222' onPress={this._action} />;
  }

  _action = async () => {
    Alert.alert(
      'Action',
      'select action',
       [
        {text: 'Cancel', style: 'cancel'},
        {text: 'FROM GALLERY', onPress: this._pickImage},
        {text: 'CAMERA', onPress: this._takePhoto},
      ]
    );
  }

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    this.setState({uploading: true});

    if (pickerResult.cancelled) return;

    try {
      const {setImages}    = this.props;
      const uploadResponse = await this._uploadImageAsync(pickerResult.uri);
      const uploadResult   = await uploadResponse.json();
      console.log(uploadResult.data);
      if (!uploadResult.error) setImages(uploadResult.data);
      else alert(uploadResult.msg);
    } catch (error) {
      console.log('error',error);
    } finally {
      this.setState({uploading: false});
    }
    
  }

  

  _uploadImageAsync = async uri => {
    const {orderid} = this.props.car_assign.active_task;
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const formData = new FormData();

    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });
    formData.append('orderid', orderid);
    
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    
    return fetch(IMG_API_URL, options);
  }
}


const mapStateToProps = ({ car_assign }) => ({ car_assign });

export default connect(mapStateToProps, {setImages})(Camera);