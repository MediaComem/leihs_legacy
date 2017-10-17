class window.App.HandOverDialogController extends Spine.Controller

  events:
    "click [data-hand-over]": "handOver"

  elements:
    "#purpose": "purposeTextArea"
    "#note": "noteTextArea"
    "#error": "errorContainer"

  constructor: (options)->
    @user = options.user
    @reservations = (App.Reservation.find id for id in App.LineSelectionController.selected)

    @orders = []
    App.Order.ajaxFetch
      data: $.param
        reservation_ids: _.map(@reservations, (r) -> r.id)
    .done (data) =>
      @orders = (App.Order.find(datum.id) for datum in data)
      @purpose = (_.uniq _.map @orders, (o) -> o.purpose).join "; "
      if @validateDialog()
        do @setupModal
        if @user.isDelegation()
          App.User.ajaxFetch
            data: $.param
              delegation_id: @user.id
          .done (data) =>
            @searchSetContactPersonController = new App.SearchSetUserController
              el: @el.find("#contact-person")
              localSearch: true
              customAutocompleteOptions:
                source: ( $.extend App.User.find(datum.id), { label: datum.name } for datum in data )
                minLength: 0
              selectCallback: =>
                @delegatedUser = App.User.find(@searchSetContactPersonController.selectedUserId)
        super
        @delegatedUser = null # reset delegated user in order to force the user to set him explicitly
        do @autoFocus
      else
        return false

  autoFocus: =>
    if @searchSetContactPersonController?.input.length
      @searchSetContactPersonController.input.focus()
    else if @purposeTextArea.length
      @purposeTextArea.focus()
    else
      @noteTextArea.focus()

  validateDialog: =>
    do @validateStartDate and do @validateEndDate and do @validateAssignment

  validateStartDate: =>
    if _.any(@reservations, (l)-> moment(l.start_date).endOf("day").diff(moment().startOf("day"), "days") > 0)
      App.Flash
        type: "error"
        message: _jed "you cannot hand out reservations which are starting in the future"
      return false
    return true

  validateEndDate: =>
    if _.any(@reservations, (l)-> moment(l.end_date).endOf("day").diff(moment().startOf("day"), "days") < 0)
      App.Flash
        type: "error"
        message: _jed "you cannot hand out reservations which are ending in the past"
      return false
    return true

  validateAssignment: =>
    if(_.any @reservations, (l) -> (l.item_id == null and l.option_id == null))
      App.Flash
        type: "error"
        message: _jed "you cannot hand out reservations with unassigned inventory codes"
      return false
    return true

  setupModal: =>
    reservations = _.map @reservations, (line)->
      line.start_date = moment().format("YYYY-MM-DD")
      line
    @itemsCount = _.reduce reservations, ((mem,l)-> l.quantity + mem), 0
    data = 
      groupedLines: App.Modules.HasLines.groupByDateRange reservations, true
      user: @user
      itemsCount: @itemsCount
      purpose: @purpose
    tmpl = $ App.Render "manage/views/users/hand_over_dialog", data, {showAddPurpose: _.any(@reservations, (l)-> not l.purpose_id?), currentInventoryPool: App.InventoryPool.current}
    tmpl.find("#add-purpose").on "click", (e)=> $(e.currentTarget).remove() and tmpl.find("#purpose-input").removeClass "hidden"
    @modal = new App.Modal tmpl
    @el = @modal.el

  handOver: =>
    if @purpose.length
      if @purposeTextArea.val()
        @purpose = "#{@purpose}; #{@purposeTextArea.val()}"
    else
      @purpose = @purposeTextArea.val()

    if @validatePurpose() and @validateDelegatedUser()
      App.Contract.create
        user_id: @user.id
        line_ids: _.map(@reservations, (l)->l.id)
        purpose: @purpose
        note: @noteTextArea.val()
        delegated_user_id: @delegatedUser?.id
      .fail (e)=>
        @errorContainer.find("strong").html(e.responseText)
        @errorContainer.removeClass("hidden")
      .done (data)=>
        @modal.undestroyable()
        @modal.el.detach()
        new App.DocumentsAfterHandOverController
          contract: new App.Contract data
          itemsCount: @itemsCount

  validatePurpose: =>
    if App.InventoryPool.current.required_purpose and not @purpose.length
      @errorContainer.find("strong").html(_jed("Specification of the purpose is required"))
      @errorContainer.removeClass("hidden")
      @purposeTextArea.focus()
      return false
    return true

  toggleAddPurpose: =>

  validateDelegatedUser: =>
    if @user.isDelegation() and not @delegatedUser
      @errorContainer.find("strong").html(_jed("Specification of the contact person is required"))
      @errorContainer.removeClass("hidden")
      @searchSetContactPersonController.input.focus()
      false
    else
      true
