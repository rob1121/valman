import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Modal,
} from 'react-native';
import {Text, Button} from 'react-native-elements';
import axios from 'axios';
import Exponent, { ImagePicker, Permissions } from 'expo';
import { connect } from 'react-redux';
import { setActiveScreen, updateActiveCar } from '../actions';
import { DEFAULT_IMG, IMG_API_URL, REMOVE_IMG_URL, ROOT_URL } from '../constants';


class CameraScreen extends React.Component {
  state = {
    uploading: false,
    viewImg: false,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    let { uploading } = this.state;
    const {active_task} = this.props.car_assign;
    let uri = `${ROOT_URL}/`;
    uri += active_task.img_path || DEFAULT_IMG;
    uri += '?random_number=' + (new Date()).getTime();

    return (
      <View style={{marginBottom: 50}} >
      
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.viewImg}
          onRequestClose={() => this.setState({...this.state, viewImg: false})}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}>
            {this.state.viewImg && <Image 
              source={{uri}}
              style={{
                width: null,
                resizeMode: 'cover',
                height: 220,
              }}
               />}
                
              <View
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 20,
                  backgroundColor: 'transparent',
                }}
              >
            <TouchableHighlight
              onPress={() => {
                this.setState({...this.state, viewImg: false});
              }}>
              <Text h3>x</Text>
            </TouchableHighlight>
              </View>

          </View>
        </Modal>

      <TouchableOpacity activeOpacity = { .5 } onPress={() => this._imgClick()}>
        <ImageBackground 
          source={{uri}} 
          style={{
            margin:15, 
            marginBottom: 0, 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 150
            }} 
        >
          {uploading && <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)', 
              width: '100%', 
              height: '100%'
            }}>
            <ActivityIndicator size="large" color="rgba(255,255,255,0.5)" />
          </View>}
        </ImageBackground>
        </TouchableOpacity>
        {(active_task.status_id == 2 || active_task.status_id == 4) && <Button
          loading={uploading}
          title={uploading ? '' : 'PICK AN IMAGE FROM CAMERA ROLL'}
          buttonStyle={{backgroundColor: '#000'}}
          onPress={this._pickImage}
        />}

        {(active_task.status_id == 2 || active_task.status_id == 4) &&<Button
          loading={uploading}
          title={uploading ? '' : 'TAKE A PHOTO'}
          buttonStyle={{backgroundColor: '#000'}}
          onPress={this._takePhoto}
        />}
      </View>
    );
  }

  _imgClick() {
    this.props.car_assign.active_task.img_path && Alert.alert(
      'Action',
      'select action for this image',
       [
        {text: 'Cancel', style: 'cancel'},
        {text: 'View', onPress: () => this._imgView()},
        {text: 'Remove', onPress: () => this._imgRemove()},
      ]
    );
  }

  _imgView() {
    this.setState({...this.state, viewImg: true});
  }

  _imgRemove() {
    axios.post(REMOVE_IMG_URL, this.props.car_assign.active_task)
      .then(({data}) => {
        this.props.updateActiveCar({ img_path: null })
      }).catch((error) => console.log(error));
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
    let uploadResponse, uploadResult;

    try {
      this.setState({...this.state,  uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await this._uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        if (!uploadResult.error) {
          this.props.updateActiveCar({ img_path: uploadResult.data.location });
        } else {
          alert(uploadResult.msg);
        }
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({...this.state,  uploading: false });
    }
  };

  _uploadImageAsync = async uri => {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let formData = new FormData();

    formData.append('photo', {
      uri,
      name: `photo_${this.props.user.id}.${fileType}`,
      type: `image/${fileType}`,
    });

    let options = {
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

const mapStateToProps = ({ nav, car_assign, user }) => ({ nav, car_assign, user });

export default connect(mapStateToProps, { updateActiveCar, setActiveScreen })(CameraScreen);