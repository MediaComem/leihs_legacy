class window.App.VisitsIndexController extends Spine.Controller

  elements:
    "#visits": "list"

  constructor: ->
    super
    new App.LinesCellTooltipController {el: @el}
    new App.UserCellTooltipController {el: @el}
    new App.LatestReminderTooltipController {el: @el}
    new App.HandOversDeleteController {el: @el}
    new App.TakeBacksSendReminderController {el: @el}
    @pagination = new App.ListPaginationController {el: @list, fetch: @fetch}
    @search = new App.ListSearchController {el: @el.find("#list-search"), reset: @reset}
    @range = new App.ListRangeController {el: @el.find("#list-range"), reset: @reset}
    @tabs = new App.ListTabsController {el: @el.find("#list-tabs"), reset: @reset, data:{status: ["approved", "signed"]}}
    do @reset

  reset: =>
    @visits = {}
    @list.html App.Render "manage/views/lists/loading"
    @fetch 1, @list

  fetch: (page, target)=>
    @fetchVisits(page).done =>
      @fetchReservations page, =>
        @fetchUsers(page).done =>
          @fetchPurposes page, => 
            @render target, @visits[page], page

  fetchVisits: (page)=>
    App.Visit.ajaxFetch
      data: $.param $.extend @tabs.getData(),
        search_term: @search.term()
        page: page
        range: @range.get()
    .done (data, status, xhr) => 
      @pagination.set JSON.parse(xhr.getResponseHeader("X-Pagination"))
      visits = (App.Visit.find(datum.id) for datum in data)
      @visits[page] = visits

  fetchReservations: (page, callback)=>
    ids = _.flatten _.map @visits[page], (v)-> v.reservation_ids
    do callback unless ids.length
    done = _.after Math.ceil(ids.length/50), callback
    _(ids).each_slice 50, (slice)=>
      App.Reservation.ajaxFetch
        data: $.param
          ids: slice
      .done done

  fetchUsers: (page)=>
    ids = _.filter (_.map @visits[page], (c) -> c.user_id), (id) -> not App.User.exists(id)?
    return {done: (c)=>c()} unless ids.length
    App.User.ajaxFetch
      data: $.param
        ids: ids
    .done (data)=>
      users = (App.User.find datum.id for datum in data)
      App.User.fetchDelegators users

  fetchPurposes: (page, callback)=>
    ids = _.compact _.filter (_.map (_.flatten (_.map @visits[page], (o) -> o.reservations().all())), (l) -> l.purpose_id), (id) -> not App.Purpose.exists(id)?
    do callback unless ids.length
    done = _.after Math.ceil(ids.length/50), callback
    _(ids).each_slice 50, (slice)=>
      App.Purpose.ajaxFetch
        data: $.param
          purpose_ids: slice
      .done done

  render: (target, data, page)=> 
    target.html App.Render "manage/views/visits/line", data
    @pagination.renderPlaceholders() if page == 1
