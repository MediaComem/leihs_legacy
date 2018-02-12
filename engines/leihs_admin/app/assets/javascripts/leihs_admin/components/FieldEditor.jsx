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
        editResult: null,
        editFieldError: null,
        fieldInput: null,
        newGroupSelected: false,
        groupInput: '',
        loading: true,
        editLoading: false
      }
    },

    allFields() {
      return this.state.fields
    },

    isEditableField(field) {

      if(!field.dynamic) {
        return false
      }

      // var attribute = field.data.attribute
      //
      // if(!(attribute instanceof Array)) {
      //   return false
      // }
      //
      // if(attribute[0] != 'properties') {
      //   return false
      // }

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
        id: '',
        label: '',
        packages: false,
        group: '',
        required: false,
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
      // if(!values) {
      //   return undefined
      // }

      return values.map((v) => {
        return {
          label: v.label,
          value: (v.value ? v.value : null)
        }
      })


    },

    readValues(field) {

      // if(!field.data.values) {
      //   return undefined
      // }

      return field.data.values.map((v) => {
        return {
          label: v.label,
          value: (v.value ? v.value : '')
        }
      })

    },

    editFieldInput(field) {
      // var field = this.state.editField //this.fieldById(fieldId)
      var input = {
        id: field.id,
        label: field.data.label,
        packages: (field.data.forPackage ? true : false),
        required: (field.data.required ? true : false),
        group: (field.data.group == null ? '' : field.data.group),
        active: field.active,
        type: field.data.type,
        target: this.readTargetType(field.data.target_type),
        // values: this.readValues(field)
      }

      if(field.data.type == 'radio' || field.data.type == 'select') {

        if(field.data.values && (field.data.values instanceof Array)) {

          input.values = this.readValues(field)


        }
      }

      return input
    },

    onEditClick(event, fieldId) {
      event.preventDefault()
      this.setState({
        editFieldId: fieldId,
        editFieldError: null,
        // showEdit: true,
        // fieldInput: this.editFieldInput(fieldId),
        newGroupSelected: false,
        groupInput: '',
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
        newGroupSelected: false,
        groupInput: '',
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
              <a onClick={e => this.onClickCreate(e)} className='btn btn-default'>
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
      return this.state.editResult.field// this.fieldById(this.state.editFieldId)
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


    readGroupFromInput() {

      if(this.state.newGroupSelected) {

        if(this.state.groupInput.trim().length > 0) {
          return this.state.groupInput
        } else {
          return null
        }
      } else {
        return (this.state.fieldInput.group == '' ? null : this.state.fieldInput.group)
      }


    },

    readFieldFromInputs() {

      var field = {}
      if(this.editMode()) {

        field = JSON.parse(JSON.stringify(this.editField()))
        field.active = this.state.fieldInput.active
        field.data.required = (this.state.fieldInput.required ? true : undefined)
        field.data.group = this.readGroupFromInput()
        field.data.label = this.state.fieldInput.label
        // field.data.attribute = ['properties', this.state.fieldInput.attribute]
        field.data.type = this.state.fieldInput.type
        field.data.forPackage = this.state.fieldInput.packages
        field.data.required = this.state.fieldInput.required
        field.data.target_type = this.writeTargetType(this.state.fieldInput.target)

        if(this.isInputMulti()) {
          field.data.values = this.writeValues(this.state.fieldInput.values)
        }



      } else {
        field = {
          id: 'properties_' + this.state.fieldInput.id,
          active: this.state.fieldInput.active,
          required: (this.state.fieldInput.required ? true : undefined),
          position: 0,
          data: {
            label: this.state.fieldInput.label,
            group: this.readGroupFromInput(),
            attribute: ['properties', this.state.fieldInput.id],
            forPackage: this.state.fieldInput.packages,
            required: this.state.fieldInput.required,
            type: this.state.fieldInput.type,
            target_type: this.writeTargetType(this.state.fieldInput.target),
            // values: this.writeValues(this.state.fieldInput.values)
          }
        }

        if(this.isInputMulti()) {
          field.data.values = this.writeValues(this.state.fieldInput.values)
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

        // if(!this.state.fieldInput.id.startsWith('properties_') || this.state.fieldInput.id.trim().length <= 11) {
        //   return false
        // }

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
      // var field = this.editField()
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
        <div className='row' style={{marginBottom: '40px'}}>
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

    mergeRequired(event) {
      // event.preventDefault()
      var value = event.target.checked
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput.required = value
          return next
        }
      )
    },

    mergePackages(event) {
      // event.preventDefault()
      var value = event.target.checked
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.fieldInput.packages = value
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
            <input disabled className='form-control' type='text' defaultValue={this.editField().id.replace('properties_', '')} />
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

    isInputMulti() {

      var isMulti = false
      if(this.state.fieldInput.type == 'radio' || this.state.fieldInput.type == 'select') {

        if(this.state.fieldInput.values && (this.state.fieldInput.values instanceof Array)) {
          isMulti = true
        }
      }

      return isMulti
    },

    renderValuesBox() {


      if(!this.isInputMulti()) {
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


    deleteEditField(event) {
      event.preventDefault()

      var fieldId = this.state.editFieldId

      $.ajax({
        url: this.props.fields_path + '/' + fieldId,
        contentType: 'application/json',
        dataType: 'json',
        method: 'DELETE'
      }).done((data) => {

        this.closeEdit()
        // if(data.result == 'field-exists-already') {
        //   this.setState({
        //     editFieldError: 'field-exists-already'
        //   })
        // } else {
        //   this.closeEdit()
        // }

      }).error((data) => {
        // this.setState({
        //   editFieldError: 'ajax-error'
        // })
      })
    },


    renderDeleteField() {

      if(!this.editMode()) {
        return null
      }

      var itemsCount = this.state.editResult.items_count
      if(itemsCount == 0) {

        return (
          <div className='row form-group'>
            <div className='col-sm-3' style={{paddingBottom: '60px'}}>
              <strong>This field is not used by any items/licenses:</strong>
            </div>
            <div className='col-sm-9'>
              <button onClick={(e) => this.deleteEditField(e)} className='btn btn-danger' type='submit'>Delete</button>
            </div>
          </div>
        )

      } else {

        return (
          <div className='row form-group'>
            <div className='col-sm-12' style={{paddingBottom: '30px'}}>
              <strong>This field is used by {itemsCount} items/licenses.</strong>
            </div>
          </div>
        )
      }




    },

    groups() {


      return _.sortBy(
        _.uniq(
          this.state.fields.map((f) => f.data.group)
        ),
        (g) => (g ? g : '')
      )

    },

    onChangeGroup(event) {
      // event.preventDefault()
      var value = event.target.value
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.newGroupSelected = false
          next.fieldInput.group = value
          return next
        }
      )
    },

    onChangeNewGroup(event) {
      // event.preventDefault()
      this.setState(
        (previous) => {
          next = _.clone(previous)
          next.newGroupSelected = true
          return next
        }
      )
    },

    renderGroup(g, i) {
      var string = (g == null ? '' : g)
      return (
        <label key={'group_' + g} style={{float: 'left', width: '200px', fontWeight: 'normal'}}>
          <div style={{width: '30px', float: 'left'}}>
            <input onChange={(e) => this.onChangeGroup(e)} value={string} name={'radio_' + i} checked={string == this.state.fieldInput.group && !this.state.newGroupSelected} type='radio' />
          </div>
          <div style={{width: '160px', float: 'left'}}>
            {(string == '' ? <span style={{fontStyle: 'italic'}}>Keine</span> : string)}
          </div>
        </label>
      )

    },

    renderGroupInput() {

      return (
        <label key={'group_input'} style={{float: 'left', width: '400px', fontWeight: 'normal'}}>
          <div style={{width: '30px', float: 'left'}}>
            <input onChange={(e) => this.onChangeNewGroup(e)} value={'radio_input'} name={'radio_input'} checked={this.state.newGroupSelected} type='radio' />
          </div>
          <div style={{width: '360px', float: 'left'}}>
            <input onChange={(e) => this.setState({groupInput: e.target.value})} type='text' value={this.state.groupInput} />
          </div>
        </label>
      )
    },

    renderGroups() {
      return this.groups().map((g, i) => {
        return this.renderGroup(g, i)
      }).concat([
        this.renderGroupInput()
      ])
    },

    renderGroupForm() {
      return (
        <div className='row form-group'>
          <div className='col-sm-3'>
            <strong>Group</strong>
          </div>
          <div className='col-sm-9'>
            {this.renderGroups()}
          </div>
        </div>
      )
    },

    renderEditFieldForm() {
      return (
        <div className='row'>
          <div className='col-sm-12'>
            {this.renderDeleteField()}
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Attribute *</strong>
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
                <strong>Active</strong>
              </div>
              <div className='col-sm-9'>
                <input onChange={(e) => this.mergeCheckbox(e, 'active')} checked={this.state.fieldInput.active} autoComplete='off' type='checkbox' />
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Required</strong>
              </div>
              <div className='col-sm-9'>
                <input onChange={(e) => this.mergeRequired(e)} checked={this.state.fieldInput.required} autoComplete='off' type='checkbox' />
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-sm-3'>
                <strong>Packages</strong>
              </div>
              <div className='col-sm-9'>
                <input onChange={(e) => this.mergePackages(e)} checked={this.state.fieldInput.packages} autoComplete='off' type='checkbox' />
              </div>
            </div>
            {this.renderGroupForm()}
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
        <div style={{marginBottom: '100px'}}>
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
          editResult: data,
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
