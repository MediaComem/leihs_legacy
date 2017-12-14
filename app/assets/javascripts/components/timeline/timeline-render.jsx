window.TimelineRender = {

  groups(data) {
    return data.props.groups
  },

  entitlementIds(data) {

    return Object.keys(data.props.availability.entitlements).map((k) => {
      if(k == '') {
        return null
      } else {
        return k
      }
    })
  },



  renderGroupQuantities(data, groupId, label) {

    var groupQuantity = function(data, d) {
      return window.TimelineGroupCalc.groupQuantity(data, groupId, d)
    }

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      label, //'Ausleihbar für Gruppe \'' + groupName + '\'',
      'group_' + groupId,
      groupQuantity
      // this.renderQuantity.bind(this)
    )
  },

  renderGeneral(data) {

    return (
      <tr key={'group_quantities_general'}>
        {this.renderGroupQuantities(data, null, 'Ausleihbar für alle')}
      </tr>
    )

  },

  renderGroupQuantitiesTr(data, groupId, label) {
    return (
      <tr key={'group_quantities_' + groupId}>
        {this.renderGroupQuantities(data, groupId, label)}
      </tr>
    )
  },

  renderGroupReservationTr(data, r) {
    return (
      <tr key={'group_reservation_' + r.reservationId}>
        {window.TimelineRenderReservation.renderReservationFrameDays(data, r)}
      </tr>
    )
  },

  renderGroupReservationTrs(data, groupId) {
    return data.reservationFrames[groupId].map((r) => {
      return this.renderGroupReservationTr(data, r)
    })
  },


  renderGroup(data, groupId, label) {
    return [
      this.renderGroupQuantitiesTr(data, groupId, label),
      this.renderGroupReservationTrs(data, groupId)
    ]
  },

  renderGroups(data) {
    return this.entitlementIds(data).map((id) => {

      var groupId = id
      var label = (id ? ('Ausleihbar für Gruppe \'' + this.groups(data)[groupId].name + '\'') : ('Ausleihbar für alle'))

      return this.renderGroup(data, groupId, label)
      // return this.renderGroupAndReservations(this.groups()[id])
    })

  },

  // renderGroupsWithReservations(data) {
  //   this.renderGroups(data).concat(this.red)
  // },

  renderTotals(data) {

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      'Total ausleihbar',
      'total',
      window.TimelineTotalCalc.totalQuantity.bind(
        window.TimelineTotalCalc
      )
      // this.renderQuantity.bind(this)
    )


  },


  renderTimeline(data) {

    return (
      <table>
        <tbody>
          <tr>
            {window.TimelineRenderHeader.renderMonths(data)}
          </tr>
          <tr>
            {window.TimelineRenderHeader.renderDays(data)}
          </tr>
          <tr>
            {this.renderTotals(data)}
          </tr>
          {this.renderGroups(data)}
        </tbody>
      </table>
    )
  }



}
