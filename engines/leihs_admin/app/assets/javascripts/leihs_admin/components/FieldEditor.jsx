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
        editField: null,
        editFieldError: null,
        fieldInput: null,
        loading: true,
        editLoading: false
      }
    },

    allFields() {
      return this.state.fields
    },

    isEditableField(field) {
      var attribute = field.data.attribute

      if(!(attribute instanceof Array)) {
        return false
      }

      if(attribute[0] != 'properties') {
        return false
      }

      return _.contains(['text', 'date', 'select', 'textarea', 'radio', 'checkbox'], field.data.type)
    },

    editableFields() {
      return _.filter(
        this.allFields(),
        (f) => this.isEditableField(f)
      )
    },

    createFieldInput() {
      return {
        id: 'properties_',
        label: '',
        attribute: '',
        active: false,
        type: 'text',
        target: 'both'
        // ,
        // values: []
      }
    },

    writeTargetType(target) {
      if(target == 'both') {
        return undefined
      } else {
        return target
      }
    },

    readTargetType(targetType) {
      if(!targetType) {
        return 'both'
      } else {
        return targetType
      }

    },

    writeValues(values) {
      if(!values) {
        return undefined
      }

      return values.map((v) => {
        return {
          label: v.label,
          value: (v.value ? v.value : null)
        }
      })


    },

    readValues(field) {

      if(!field.data.values) {
        return undefined
      }

      return field.data.values.map((v) => {
        return {
          label: v.label,
          value: (v.value ? v.value : '')
        }
      })

    },

    editFieldInput(field) {
      // var field = this.state.editField //this.fieldById(fieldId)
      return {
        id: field.id,
        label: field.data.label,
        attribute: field.data.attribute[1],
        active: field.active,
        type: field.data.type,
        target: this.readTargetType(field.data.target_type),
        values: this.readValues(field)
      }
    },

    onEditClick(event, fieldId) {
      event.preventDefault()
      this.setState({
        editFieldId: fieldId,
        editFieldError: null,
        // showEdit: true,
        // fieldInput: this.editFieldInput(fieldId),
        editLoading: true
      }, () => {
        this.loadEdit()
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

    closeEdit() {
      this.setState({
        showEdit: false,
        editFieldId: null,
        editFieldError: null,
        loading: true
      }, () => {
        this.loadList()
      })
    },

    cancelEdit(event) {
      event.preventDefault()
      this.closeEdit()
    },

    editField() {
      return this.state.editField// this.fieldById(this.state.editFieldId)
    },

    editMode() {
      return this.state.editFieldId ? true : false
    },

    renderEditFieldTitle() {

      if(this.editMode()) {
        var field = this.editField()
        return (
          <div className='col-sm-8'>
            <h1>Edit Field {'\'' + field.data.label + '\''}</h1>
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
        field.active = this.state.fieldInput.active
        field.data.label = this.state.fieldInput.label
        field.data.attribute = ['properties', this.state.fieldInput.attribute]
        field.data.type = this.state.fieldInput.type
        field.data.target_type = this.writeTargetType(this.state.fieldInput.target)
        field.data.values = this.writeValues(this.state.fieldInput.values)

      } else {
        field = {
          id: this.state.fieldInput.id,
          active: this.state.fieldInput.active,
          position: 0,
          data: {
            label: this.state.fieldInput.label,
            attribute: ['properties', this.state.fieldInput.attribute],
            type: this.state.fieldInput.type,
            target_type: this.writeTargetType(this.state.fieldInput.target),
            values: this.writeValues(this.state.fieldInput.values)
          }
        }
      }



      return field
    },

    ajaxConfig() {

      if(this.editMode()) {
        return {
          path: this.props.update_path,
          type: 'POST'
        }
      } else {
        return {
          path: this.props.new_path,
          type: 'PUT'
        }
      }

    },


    validateInputs() {

      if(!this.editMode()) {

        if(!this.state.fieldInput.id.startsWith('properties_') || this.state.fieldInput.id.trim().length <= 11) {
          return false
        }

      }

      return true

    },


    saveEditField() {

      if(!this.validateInputs()) {
        return;
      }

      var field = this.readFieldFromInputs()

      var config = this.ajaxConfig()

      $.ajax({
        url: config.path,
        // type: config.type,
        contentType: 'application/json',
        dataType: 'json',
        method: config.type,
        data: JSON.stringify({
          field: field
        })
      }).done((data) => {

        if(data.result == 'field-exists-already') {
          this.setState({
            editFieldError: 'field-exists-already'
          })
        } else {
          this.closeEdit()
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

    mergeCheckbox(event, attribute) {
      // event.preventDefault()
      var value = event.target.checked
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput[attribute] = value
          return next
        }
      )
    },

    mergeSelect(event, attribute) {
      event.preventDefault()
      var value = event.target.value
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput[attribute] = value

          if(attribute == 'type') {
            if(value == 'radio' || value == 'select') {
              next.fieldInput.values = [{label: '', value: ''}]
            } else {
              next.fieldInput.values = undefined
            }
          }
          return next
        }
      )
    },

    mergeValuesLabel(event, index) {
      event.preventDefault()
      var value = event.target.value
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput.values[index].label = value
          return next
        }
      )
    },

    mergeValuesValue(event, index) {
      event.preventDefault()
      var value = event.target.value
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput.values[index].value = value
          return next
        }
      )
    },

    removeValuesValue(event, index) {
      event.preventDefault()
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput.values = _.reject(next.fieldInput.values, (v, i) => i == index)
          return next
        }
      )
    },

    addValuesValue(event) {
      event.preventDefault()
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput.values.push({label: '', value: ''})
          return next
        }
      )
    },

    renderIdInput() {

      if(this.editMode()) {

        return (
          <div className='col-sm-9'>
            <input disabled className='form-control' type='text' defaultValue={this.editField().id} />
          </div>
        )


      } else {
        return (
          <div className='col-sm-9'>
            <input onChange={(e) => this.mergeInput(e, 'id')} className='form-control' type='text' value={this.state.fieldInput.id} />
          </div>
        )

      }

    },


    renderValue(v, i, last) {

      var renderMinus = (i, last) => {
        if(last && i == 0) {
          return null
        }
        return (
          <a onClick={(e) => this.removeValuesValue(e, i)} className='btn btn-default'>-</a>
        )
      }

      var renderPlus = (last) => {

        if(!last) {
          return null
        }

        return (
          <a onClick={(e) => this.addValuesValue(e)} className='btn btn-default'>+</a>
        )
      }

      return (
        <div key={'value_' + i} className='row form-group'>
          <div className='col-sm-5'>
            <input onChange={(e) => this.mergeValuesLabel(e, i)} className='form-control' type='text' value={v.label} />
          </div>
          <div className='col-sm-5'>
            <input onChange={(e) => this.mergeValuesValue(e, i)} className='form-control' type='text' value={v.value} />
          </div>
          <div className='col-sm-2 line-actions'>
            {renderMinus(i, last)}
            {renderPlus(last)}
          </div>
        </div>

      )


    },

    renderValuesBox() {

      var type = this.state.fieldInput.type
      if(!(type == 'select' || type == 'radio')) {
        return null
      }

      var values = this.state.fieldInput.values

      var header = (
        <div key={'header'} className='row form-group' style={{marginTop: '20px'}}>
          <div className='col-sm-5'>
            <strong>Label</strong>
          </div>
          <div className='col-sm-5'>
            <strong>Value</strong>
          </div>
          <div className='col-sm-2 line-actions'>
          </div>
        </div>

      )

      return [header].concat(values.map((v, i) => {
        return this.renderValue(v, i, values.length - 1 == i)
      }))

    },


    renderEditFieldForm() {
      return (
        <div className='row'>
          <div className='col-sm-12'>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Id *</strong>
              </div>
              {this.renderIdInput()}
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Name *</strong>
              </div>
              <div className='col-sm-9'>
                <input onChange={(e) => this.mergeInput(e, 'label')} className='form-control' type='text' value={this.state.fieldInput.label} />
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Attribute *</strong>
              </div>
              <div className='col-sm-9'>
                <input onChange={(e) => this.mergeInput(e, 'attribute')} className='form-control' type='text' value={this.state.fieldInput.attribute} />
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Active</strong>
              </div>
              <div className='col-sm-9'>
                <input onChange={(e) => this.mergeCheckbox(e, 'active')} checked={this.state.fieldInput.active} autoComplete='off' type='checkbox' />
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Target</strong>
              </div>
              <div className='col-sm-9'>
                <select value={this.state.fieldInput.target} onChange={(e) => this.mergeSelect(e, 'target')}>
                  <option value='both'>Beides</option>
                  <option value='item'>Gegenstand</option>
                  <option value='license'>Lizenz</option>
                </select>
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Type</strong>
              </div>
              <div className='col-sm-9'>
                <select value={this.state.fieldInput.type} onChange={(e) => this.mergeSelect(e, 'type')}>
                  <option value='text'>Text</option>
                  <option value='date'>Date</option>
                  <option value='select'>Select</option>
                  <option value='textarea'>Textarea</option>
                  <option value='radio'>Radio</option>
                  <option value='checkbox'>Checkbox</option>
                </select>
                {this.renderValuesBox()}
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
      var fields = _.sortBy(this.editableFields(), (field) => field.data.label)
      return fields.map(f => {
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
          <div className='panel-body' style={{paddingTop: '0px', paddingBottom: '0px'}}>
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

    componentDidMount() {

      this.loadList()

    },

    loadEdit() {
      $.ajax({
        url: this.props.single_field_path,
        // type: config.type,
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET',
        data: {id: this.state.editFieldId}
      }).done((data) => {
        this.setState({
          editField: data.field,
          showEdit: true,
          fieldInput: this.editFieldInput(data.field),
          editLoading: false
        })

      }).error((data) => {

      })

    },

    loadList() {

      $.ajax({
        url: this.props.all_fields_path,
        // type: config.type,
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET',
        data: JSON.stringify({})
      }).done((data) => {
        this.setState({
          fields: data.fields,
          loading: false
        })

      }).error((data) => {

      })

    },

    render () {

      if(this.state.loading || this.state.editLoading) {
        return (
          <div></div>
        )
      }

      if(this.state.showEdit) {
        return this.renderEditField()
      } else {
        return this.renderOverview()
      }

    }
  })
})()
