(() => {
  const React = window.React

  window.FieldEditor = window.createReactClass({
    propTypes: {
    },

    displayName: 'FieldEditor',

    getInitialState () {
      return {
      }
    },

    allFields() {
      return this.props.fields
    },

    isEditableField(field) {
      var attribute = field.data.attribute
      if(attribute instanceof Array) {
        return attribute[0] == 'properties'
      } else {
        return false
      }
    },

    editableFields() {
      return _.filter(
        this.allFields(),
        (f) => this.isEditableField(f)
      )
    },

    render () {

      return (
        <div>
          <div className='panel'>
            <div className='row'>
              <div className='col-sm-6'>
                <h1>Feld Editor</h1>
              </div>
            </div>
          </div>
        </div>
      )
    }
  })
})()
