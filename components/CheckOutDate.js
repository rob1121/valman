import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

export default class CheckOutDate extends Component {
  render() {
    return (
      <DatePicker
        style={{ width: 200 }}
        date={this.props.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys. 
        }}
        onDateChange={this.props.onDateChange}
      />
    )
  }
}