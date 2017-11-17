import React from 'react'
import createReactClass from 'create-react-class'

/* eslint-disable react/prop-types */
export const InventoryFilterSelect = createReactClass({
  propTypes: {},

  _onChange(event) {
    event.preventDefault()
    // this.setState({value: event.target.value})
    this.props.onChange(event.target.value)
  },

  _renderOption(value) {
    return (
      <option key={'value_' + value.value} value={value.value}>
        {value.label}
      </option>
    )
  },

  _renderOptions() {
    return this.props.values.map(v => {
      return this._renderOption(v)
    })
  },

  render() {
    var style = {}
    if (this.props.hide) {
      style.display = 'none'
    }

    return (
      <select
        name={this.props.name}
        style={style}
        value={this.props.value}
        onChange={this._onChange}
        className="width-full">
        {this._renderOptions()}
      </select>
    )
  }
})
