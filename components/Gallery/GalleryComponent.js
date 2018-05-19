import React from 'react';
import {
  Alert,
  View,
  Modal,
  TouchableHighlight
} from 'react-native';
import {Text, Button} from 'react-native-elements';
import axios from 'axios';
import Exponent, { ImagePicker, Permissions } from 'expo';
import {map, chunk, size} from 'lodash';
import { connect } from 'react-redux';
import { setActiveScreen, updateActiveCar } from '../../actions';
import { DEFAULT_IMG, IMG_API_URL, REMOVE_IMG_URL, ROOT_URL, EMPTY } from '../../constants';
import Camera from './Camera';
import Image from './Image';

class GalleryComponent extends React.Component {
  state = {
    uploading: false,
    viewImg: false
  }

  render() {
    let { uploading } = this.state;
    const {gallery, car_assign: {active_task}} = this.props;

    let uri = this._generateImagePath(DEFAULT_IMG);

    images = chunk(gallery, 4);
    images = map(images, (imageGroup, grpIdx) => {
      imageGroup = map(imageGroup, (img,index) => (<Image key={index} uri={this._generateImagePath(img.path)} onPress={() => this._action(images.id)} />));

      return (<View key={grpIdx} style={{display: 'flex', flexDirection: 'row', margin: 5, justifyContent:'space-between'}}>{imageGroup}</View>)
    });
    
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
        {(active_task.status_id == 2 || active_task.status_id == 4) && (size(gallery) < 5) && <Camera />} 
        <View style={{flex: 1, margin: 15}}>
          <Text>Photos</Text>
          {(size(gallery) == EMPTY) ? <Text style={{textAlign: 'center'}}>No Photos captured</Text> : images}
        </View>
      </View>
    );
  }

  _action = (id) => {
    Alert.alert(
      'Action',
      'select action',
       [
        {text: 'Cancel', style: 'cancel'},
        {text: 'View', onPress: this._imgView},
        {text: 'Remove', onPress: this._imgRemove(id)},
      ]
    );
  }

  _imgView = () => {
    this.setState({...this.state, viewImg: true});
  }

  _imgRemove = (id) => {
    //remove image by id



    // axios.post(REMOVE_IMG_URL, this.props.car_assign.active_task)
    //   .then(({data}) => {
    //     this.props.updateActiveCar({ img_path: null })
    //   }).catch((error) => console.log(error));
  }

  _generateImagePath = path => {
    let uri = `${ROOT_URL}/`;
    uri += path;
    uri += '?random_number=' + (new Date()).getTime();

    return uri;
  }
}

const mapStateToProps = ({ car_assign, gallery }) => ({ car_assign, gallery });

export default connect(mapStateToProps)(GalleryComponent);