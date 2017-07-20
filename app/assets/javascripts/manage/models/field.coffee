###
  
  Field is needed to edit/insert data of an item to the system

###

class window.App.Field extends Spine.Model

  @configure "Field", "id", "attribute", "default", "display_attr", "display_attr_ext", "forPackage",
                      "extended_key", "extensible", "form_name", "group", "label",
                      "permissions", "required", "search_attr", "search_path", "type", "value_attr",
                      "item_value_label", "item_value_label_ext", "values", "visibility_dependency_field_id", "visibility_dependency_value",
                      "exclude_from_submit", "values_dependency_field_id", "values_url", "values_label_method"
  
  @extend Spine.Model.Ajax

  @url = => "/manage/#{App.InventoryPool.current.id}/fields"

  constructor: ->
    super

  getLabel: ->  _jed(@label)

  isEditable: (item)->
    editable = true
    if @permissions? and item?
      editable = false if @permissions.role? and not App.AccessRight.atLeastRole(App.User.current.role, @permissions.role)
      editable = false if @permissions.owner? and @permissions.owner and item.owner? and App.InventoryPool.current.id != item.owner.id
    editable

  getValue: (item, attribute, defaultFallback)->
    if item?
      value =
        if attribute instanceof Array
          _.reduce attribute, (hash, attr) -> 
            if hash? and hash[attr]?
              hash[attr]
            else
              null
          , item
        else
          item[attribute]

    # some special behavior for retired ;(
    value = !! value if attribute == "retired"

    if value?
      value = accounting.formatMoney(value, {format: "%v"}) if @currency?
      return value
    else if @default? and defaultFallback
      @default
    else
      null

  getItemValueLabel: (item_value_label, item)=>
    if item?
      # local helper function
      reduceHelper = (valueLabel) ->
        if valueLabel instanceof Array
          _.reduce valueLabel, (hash, attr) -> 
            if hash? and hash[attr]?
              hash[attr]
            else 
              null
          , item
        else
          item[valueLabel]

      result = reduceHelper(item_value_label)

      # append extended value label if present
      result = [result, item_value_label_ext].join(" ") if item_value_label_ext = reduceHelper(@item_value_label_ext)

      result

  getFormName: (attribute = @attribute, formName = @form_name, asArray = null) ->
    if formName?
      "item[#{formName}]"
    else if attribute instanceof Array
      formName = _.reduce attribute, (name, attr) -> 
        "#{name}[#{attr}]"
      , "item"
      formName += "[]" if asArray?
      formName
    else
      "item[#{attribute}]"

  getExtendedKeyFormName: -> @getFormName @extended_key, @form_name

  children: ->
    _.filter App.Field.all(), (field)=> field.visibility_dependency_field_id == @id

  childrenWithValueDependency: ->
    _.filter App.Field.all(), (field)=> field.values_dependency_field_id == @id

  descendants: ->
    children = @children()
    if _.isEmpty children
      children
    else
      _.union children, _.flatten _.map children, (field) -> field.descendants()

  parent: ->
    if @visibility_dependency_field_id?
      App.Field.find @visibility_dependency_field_id

  parentWithValueDependency: ->
    if @values_dependency_field_id?
      App.Field.find @values_dependency_field_id

  getValueLabel: (values, value)-> 
    value = null if value == undefined
    value = _.find(values, (v) -> String(v.value) == value or v.value == value)
    if value
      value.label
    else
      ""

  @getValue: (target)->
    field = App.Field.find target.data("id")
    if target.find("[data-value]").length
      target.find("[data-value]").attr "data-value"
    else
      switch field.type
        when "radio"
          target.find("input:checked").val()
        when "date"
          target.find("input[type=hidden]").val()
        when "autocomplete"
          target.find("input[type=hidden]").val()
        when "autocomplete-search"
          target.find("input[type=hidden]").val()
        when "text"
          target.find("input[type=text]").val()
        when "textarea"
          target.find("textarea").val()
        when "select"
          target.find("option:selected").val()

  @validate: (form)=>
    valid = true
    form.find(".error").removeClass("error")
    for requiredField in form.find("[data-required='true'][data-editable='true']:visible")
      value = App.Field.getValue $ requiredField
      if not value? or value.length == 0
        valid = false 
        $(requiredField).addClass("error")
    return valid

  @toggleChildren: (target, form, options, forPackage)->
    field = App.Field.find target.data("id")
    form = $(form)
    children = field.children() if field.children?

    if children? and children.length

      for child in children
        dep_value = child.visibility_dependency_value

           # check if parent's value is the dependancy value
        if ( App.Field.getValue(target) == dep_value or _.contains(dep_value, App.Field.getValue(target)) ) or \
           # check if the dependancy value is undefined and the parent is present
           ( _.isUndefined(dep_value) and App.Field.isPresent(App.Field.find(child.visibility_dependency_field_id), form) )

          unless App.Field.isPresent child, form
            if (forPackage and child.forPackage) or not forPackage
              target.after App.Render "manage/views/items/field", {}, $.extend(options, {field: child})
              child_el = $("[data-type='field'][data-id='#{child.id}']")
              new App.CompositeFieldController {el: child_el, data: options} if child.type == "composite"

              # recurse if there is a nested dependency relation
              children = child.children() if child.children?
              Field.toggleChildren(child_el, form, options, forPackage) if children? and children.length

        else
          # remove element and all its dependent descendants
          form.find("[data-type='field'][data-id='#{element.id}']").remove() for element in [child].concat(child.descendants())

  @isPresent: (field, form)-> !! $(form).find("[data-id='#{field.id}']").length

  @grouped: (fields)-> _.groupBy fields, (field)-> if (field.group == null) then "" else field.group
