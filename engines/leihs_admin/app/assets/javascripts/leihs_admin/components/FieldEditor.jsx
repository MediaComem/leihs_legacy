(() => {
  const React = window.React

  window.FieldEditor = window.createReactClass({
    propTypes: {
    },

    displayName: 'FieldEditor',

    getInitialState () {
      return {
        showEdit: false,
        editFieldId: null,
        editFieldError: null,
        fieldInput: null
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

    createFieldInput() {
      return {
        id: '',
        label: ''
      }
    },

    editFieldInput(fieldId) {
      var field = this.fieldById(fieldId)
      return {
        id: field.id,
        label: field.data.label
      }
    },

    onEditClick(event, fieldId) {
      event.preventDefault()
      this.setState({
        showEdit: true,
        editFieldId: fieldId,
        editFieldError: null,
        fieldInput: this.editFieldInput(fieldId)
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

    onClickCreate(event) {
      event.preventDefault()
      this.setState({
        showEdit: true,
        editFieldId: null,
        editFieldError: null,
        fieldInput: this.createFieldInput()
      })
    },

    renderTitle() {
      return (
        <div className='panel'>
          <div className='row'>
            <div className='col-sm-6'>
              <h1>Feld Editor</h1>
            </div>

            <div className='col-sm-6 text-right'>
              <a onClick={e => this.onClickCreate(e)} className='btn btn-default' href='/admin/suppliers/new'>
                <i className='fa fa-plus'></i>
                {' '}
                Feld erstellen
              </a>
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
        showEdit: false,
        editFieldId: null,
        editFieldError: null
      })
    },

    editField() {
      return this.fieldById(this.state.editFieldId)
    },

    editMode() {
      return this.state.editFieldId ? true : false
    },

    renderEditFieldTitle() {

      if(this.editMode()) {
        var field = this.editField()
        return (
          <div className='col-sm-8'>
            <h1>Edit Field {field.id}</h1>
          </div>
        )
      } else {
        return (
          <div className='col-sm-8'>
            <h1>New Field</h1>
          </div>
        )
      }

    },

    readFieldFromInputs() {

      var field = {}
      if(this.editMode()) {

        field = JSON.parse(JSON.stringify(this.editField()))
        field.data.label = this.state.fieldInput.label

      } else {
        field = {
          id: this.state.fieldInput.id,
          active: false,
          position: 0,
          data: {
            label: this.state.fieldInput.label
          }

        }
      }



      return field
    },

    ajaxConfig() {

      if(this.editMode()) {
        return {
          path: this.props.update_path,
          type: 'post'
        }
      } else {
        return {
          path: this.props.new_path,
          type: 'put'
        }
      }

    },

    saveEditField() {

      var field = this.readFieldFromInputs()

      var config = this.ajaxConfig()

      $.ajax({
        url: config.path,
        type: config.type,
        data: {
          field: field
        }
      }).done((data) => {

        if(data.result == 'field-exists-already') {
          this.setState({
            editFieldError: 'field-exists-already'
          })
        } else {
          this.setState({
            showEdit: false,
            editFieldId: null,
            editFieldError: null
          })
        }

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
      if(this.state.editFieldError == 'field-exists-already') {
        return 'Ein Feld mit dieser Id existiert schon.'
      } else {
        return 'Ein unerwarteter Fehler ist aufgetreten.'
      }

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

    mergeInput(event, attribute) {
      event.preventDefault()
      var value = event.target.value
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput[attribute] = value
          return next
        }
      )
    },

    renderIdInput() {

      if(this.editMode()) {

        return (
          <div className='col-sm-6'>
            <input disabled className='form-control' type='text' defaultValue={this.editField().id} />
          </div>
        )


      } else {
        return (
          <div className='col-sm-6'>
            <input onChange={(e) => this.mergeInput(e, 'id')} className='form-control' type='text' value={this.state.fieldInput.id} />
          </div>
        )

      }

    },



    renderEditFieldForm() {
      return (
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row form-group'>
              <div className='col-sm-6'>
                <strong>Id *</strong>
              </div>
              {this.renderIdInput()}
            </div>
            <div className='row form-group'>
              <div className='col-sm-6'>
                <strong>Name *</strong>
              </div>
              <div className='col-sm-6'>
                <input onChange={(e) => this.mergeInput(e, 'label')} className='form-control' type='text' value={this.state.fieldInput.label} />
              </div>
            </div>
          </div>
        </div>
      )
    },

    renderEditField() {
      var field = this.fieldById(this.state.editFieldId)
      return (
        <div>
          {this.renderEditFieldFlash()}
          {this.renderEditFieldHeader()}
          {this.renderEditFieldForm()}
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

      if(this.state.showEdit) {
        return this.renderEditField()
      } else {
        return this.renderOverview()
      }

    }
  })
})()
