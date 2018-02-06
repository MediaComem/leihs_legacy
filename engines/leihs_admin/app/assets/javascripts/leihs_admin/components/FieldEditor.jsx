(() => {
  const React = window.React

  window.FieldEditor = window.createReactClass({
    propTypes: {
    },

    displayName: 'FieldEditor',

    getInitialState () {
      return {
        editFieldId: null
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

    onEditClick(event, fieldId) {
      event.preventDefault()
      this.setState({
        editFieldId: fieldId
      })
    },

    renderEditButton(fieldId) {
      return (
        <div className='col-sm-2 text-right line-actions'>
          <a onClick={(e) => this.onEditClick(event, fieldId)} className='btn btn-default'>
            Editieren
          </a>
        </div>
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

    fieldById(fieldId) {
      return _.find(this.allFields(), (f) => f.id == fieldId)
    },

    cancelEdit(event) {
      event.preventDefault()
      this.setState({
        editFieldId: null,
        editFieldError: null
      })
    },

    editField() {
      return this.fieldById(this.state.editFieldId)
    },

    renderEditFieldTitle(field) {
      var field = this.editField()
      return (
        <div className='col-sm-8'>
          <h1>Edit Field {field.id}</h1>
        </div>
      )
    },

    saveEditField() {
      var field = this.editField()
      $.ajax({
        url: this.props.update_path,
        type: 'post',
        data: {
          field: field
        }
      }).done((data) => {
        this.setState({
          editFieldId: null,
          editFieldError: null
        })
      }).error((data) => {
        this.setState({
          editFieldError: 'ajax-error'
        })
      })
    },

    renderEditFieldButtons() {
      var field = this.editField()
      return (
        <div className='col-sm-4 text-right'>
          <a onClick={(e) => this.cancelEdit(e)} className='btn btn-default'>Abbrechen</a>
          {' '}
          <button onClick={(e) => this.saveEditField()} className='btn btn-success' type='submit'>Speichern</button>
        </div>
      )
    },

    renderEditFieldHeader() {
      return (
        <div className='row'>
          {this.renderEditFieldTitle()}
          {this.renderEditFieldButtons()}
        </div>
      )
    },

    renderErrorMessage() {
      return 'Ein unerwarteter Fehler ist aufgetreten.'
    },


    renderEditFieldFlash() {

      if(!this.state.editFieldError) {
        return null
      }

      return (
        <h4 className='alert alert-danger error'>
          <ul>
            <li>{this.renderErrorMessage()}</li>
          </ul>
        </h4>
      )
    },

    renderEditField() {
      var field = this.fieldById(this.state.editFieldId)
      return (
        <div>
          {this.renderEditFieldFlash()}
          {this.renderEditFieldHeader()}
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
            <div className='col-sm-6'>
              {JSON.stringify(f)}
            </div>
            {this.renderEditButton(f.id)}
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

    renderOverview() {
      return (
        <div>
          {this.renderTitle()}
          {this.renderEditableFieldsBox()}
        </div>
      )

    },

    render () {

      if(this.state.editFieldId) {
        return this.renderEditField()
      } else {
        return this.renderOverview()
      }

    }
  })
})()
