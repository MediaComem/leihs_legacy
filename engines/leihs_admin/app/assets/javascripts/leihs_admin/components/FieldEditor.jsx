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

    renderTitle() {
      return (
        <div className='panel'>
          <div className='row'>
            <div className='col-sm-6'>
              <h1>Feld Editor</h1>
            </div>
          </div>
        </div>
      )
    },

    renderEditableFields() {
      return this.editableFields().map(f => {
        return (
          <div key={'editable_field_' + f.id} className='row' style={{wordBreak: 'break-word', paddingTop: '15px', paddingBottom: '15px'}}>
            <div className='col-sm-4'>
              <strong>
                {f.data.label}
              </strong>
            </div>
            <div className='col-sm-8'>
              {JSON.stringify(f)}
            </div>
          </div>
        )
      })
    },

    renderEditableFieldsBox() {
      return (
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <h4>Editierbare Felder</h4>
          </div>
          <div className='panel-body'>
            <div className='list-of-lines'>
              {this.renderEditableFields()}
            </div>
          </div>
        </div>
      )
    },

    render () {

      return (
        <div>
          {this.renderTitle()}
          {this.renderEditableFieldsBox()}
        </div>
      )
    }
  })
})()
