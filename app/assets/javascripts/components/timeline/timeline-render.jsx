window.TimelineRender = {

  groups(data) {
    return data.props.groups
  },

  entitlementIds(data) {
    return _.compact(Object.keys(data.props.availability.entitlements))
  },



  renderGroupQuantities(data, group) {

    var groupQuantity = function(data, d) {
      return window.TimelineGroupCalc.groupQuantity(data, group.id, d)
    }

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      'Verfügbar in Gruppe \'' + group.name + '\'',
      'group_' + group.id,
      groupQuantity
      // this.renderQuantity.bind(this)
    )



  },

  renderGeneralQuantities(data) {
    var groupQuantity = function(data, d) {
      return window.TimelineGroupCalc.groupQuantity(data, null, d)
    }

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      'Verfügbar für alle',
      'group_general',
      groupQuantity
      // this.renderQuantity.bind(this)
    )


  },

  renderGeneral(data) {

    return (
      <tr key={'group_quantities_general'}>
        {this.renderGeneralQuantities(data)}
      </tr>
    )

  },


  renderGroup(data, group) {

    return (
      <tr key={'group_quantities_' + group.id}>
        {this.renderGroupQuantities(data, group)}
      </tr>
    )

  },

  renderGroups(data) {
    return this.entitlementIds(data).map((id) => {
      return this.renderGroup(data, this.groups(data)[id])
      // return this.renderGroupAndReservations(this.groups()[id])
    })

  },

  renderTotals(data) {

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      'Total verfügbar',
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
          {this.renderGeneral(data)}

        </tbody>
      </table>
    )
  }



}
