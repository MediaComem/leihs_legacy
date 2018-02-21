(() => {
  // NOTE: only for linter and clarity:
  /* global _ */
  /* global _jed */
  const React = window.React
  const ReactDOM = window.ReactDOM
  const Autocomplete = window.ReactAutocomplete
  React.findDOMNode = ReactDOM.findDOMNode // NOTE: autocomplete lib needs this

  window.InputDate = window.createReactClass({
    propTypes: {
    },


    _onChange(date) {
      var l = window.lodash
      var value = l.cloneDeep(this.props.selectedValue.value)
      value.at = date
      this.props.onChange(value)
    },


    render () {
      const props = this.props
      const selectedValue = props.selectedValue



      return (
        <div className='col1of2' data-type='value'>
          <DatePickerWithInput value={selectedValue.value.at} name={'item[' + selectedValue.field.id + ']'} onChange={this._onChange} />
        </div>
      )


    }
  })
})()
