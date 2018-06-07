import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {FETCH_IMAGES} from '../../constants';
import {setImages} from '../../actions';
import {errorHandler} from '../../utilities';
import GalleryComponent from './GalleryComponent';

class GalleryIndex extends React.Component {
  componentWillMount() {
    const { active_task } = this.props.car_assign;
    axios.post(FETCH_IMAGES, {orderid:active_task.orderid})
      .then(this._setImg) 
      .catch(errorHandler)
    ;
  }

  _setImg = ({data}) => this.props.setImages(data)
  
  render() {
    return (
      <GalleryComponent />
    );
  }
}

const mapStateToProps = ({ car_assign }) => ({ car_assign});

export default connect(mapStateToProps,{setImages})(GalleryIndex);
