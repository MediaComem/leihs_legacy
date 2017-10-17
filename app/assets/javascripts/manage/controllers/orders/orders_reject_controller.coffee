class window.App.OrdersRejectController extends Spine.Controller
  events:
    "click [data-order-reject]": "setupModal"

  setupModal: (e)=>
    @trigger = $ e.currentTarget
    @order = App.Order.findOrBuild @trigger.closest("[data-id]").data()
    callback = =>
      @modal = new App.Modal App.Render "manage/views/orders/reject_modal", @order
      @modal.el.on "submit", "form", @reject if @async
    @fetchData @order, callback

  reject: (e)=>
    e.preventDefault()
    comment = @modal.el.find("#rejection-comment").val()
    @order.reject comment
    @modal.destroy true
    callback = @callback ? =>
      buttons = $(@trigger).closest(".line-actions-column")
      if buttons
        buttons.replaceWith('<div class="col2of8 line-col line-actions-column"><strong>' + _jed("Rejected") + '</strong></div>')
    callback.call @

  fetchData: (record, callback)=>
    modelIds = []
    optionIds = []
    for line in record.reservations().all()
      if line.model_id?
        modelIds.push(line.model_id) unless App.Model.exists(line.model_id)?
      else if line.option_id?
        optionIds.push(line.option_id) unless App.Option.exists(line.option_id)?
    @fetchModels(modelIds).done => @fetchOptions(optionIds).done => do callback

  fetchModels: (ids)=>
    if ids.length
      App.Model.ajaxFetch
        data: $.param
          ids: ids
    else
      {done: (c)->c()}

  fetchOptions: (ids)=>
    if ids.length
      App.Option.ajaxFetch
        data: $.param
          ids: ids
    else
      {done: (c)->c()}
