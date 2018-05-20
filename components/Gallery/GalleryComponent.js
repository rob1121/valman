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
import ImagePreview from 'react-native-image-preview';

import { setImages } from '../../actions';
import { generateImagePath, errorHandler } from '../../utilities';
import { DEFAULT_IMG, IMG_API_URL, REMOVE_IMG_URL, EMPTY } from '../../constants';
import Camera from './Camera';
import Image from './Image';

class GalleryComponent extends React.Component {
  state = {
    uploading: false,
    viewImg: false,
    activeImg: ''
  }

  render() {
    let { uploading, activeImg, viewImg } = this.state;
    const {gallery, car_assign: {active_task}} = this.props;

    let uri = generateImagePath(DEFAULT_IMG);

    images = chunk(gallery, 4);
    images = map(images, (imageGroup, grpIdx) => {
      imageGroup = map(imageGroup, (img,index) => (
        <Image 
          key={index} 
          uri={generateImagePath(img.path)} 
          onPress={() => this._imgTrigger(img)} 
        />)
      );

      return (
        <View 
          key={grpIdx} 
          style={{display: 'flex', flexDirection: 'row', margin: 5, justifyContent:'space-between'}}
        >{imageGroup}
        </View>
      );
    });
    
    return (
      <View style={{marginBottom: 50}} >
      

        <ImagePreview 
          visible={viewImg} 
          source={{ uri: activeImg }} 
          close={() => this.setState({ ...this.state, viewImg: false })} 
        />
        {(active_task.status_id == 2 || active_task.status_id == 4) && (size(gallery) < 5) && <Camera />} 
        <View style={{flex: 1, margin: 15}}>
          <Text>Photos</Text>
          {(size(gallery) == EMPTY) ? <Text style={{textAlign: 'center'}}>No Photos captured</Text> : images}
        </View>
      </View>
    );
  }

  _imgTrigger = ({path, id}) => {
    path = generateImagePath(path);

    Alert.alert(
      'Action',
      'select action',
       [
        {text: 'Cancel', style: 'cancel'},
        {text: 'View', onPress: () => this._imgView(path)},
         { text: 'Remove', onPress: () => this._imgRemove(id)},
      ]
    );
  }

  _imgView = path => {
    this.setState({ ...this.state, viewImg: true, activeImg: path })
  }

  _imgRemove = id => {
    axios.post(REMOVE_IMG_URL, {id})
      .then(this._rmEvnt)
      .catch(errorHandler)
    ;
  }

  _rmEvnt = ({ data }) => {
    console.log(data);
    this.props.setImages(data);
  }
}

const mapStateToProps = ({ car_assign, gallery }) => ({ car_assign, gallery });

export default connect(mapStateToProps, {setImages})(GalleryComponent);