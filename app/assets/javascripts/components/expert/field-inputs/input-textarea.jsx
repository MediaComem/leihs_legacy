(() => {
  // NOTE: only for linter and clarity:
  /* global _ */
  /* global _jed */
  const React = window.React
  const ReactDOM = window.ReactDOM
  const Autocomplete = window.ReactAutocomplete
  React.findDOMNode = ReactDOM.findDOMNode // NOTE: autocomplete lib needs this

  window.InputTextarea = window.createReactClass({
    propTypes: {
    },


    _onChange(event) {
      event.preventDefault()
      var l = window.lodash
      var value = l.cloneDeep(this.props.selectedValue.value)
      value.text = event.target.value
      this.props.onChange(value)
    },


    render () {
      const props = this.props
      const selectedValue = props.selectedValue

      return (
        <div className='col1of2' data-type='value'>
          <textarea autoComplete='off' className='width-full' rows='5' name={'item[' + selectedValue.field.id + ']'}
            value={selectedValue.value.text} onChange={this._onChange}></textarea>
        </div>
      )


    }
  })
})()
