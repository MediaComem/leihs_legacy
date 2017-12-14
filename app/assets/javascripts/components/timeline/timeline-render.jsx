window.TimelineRender = {

  groups(data) {
    return data.props.groups
  },

  entitlementIds(data) {
    return _.compact(Object.keys(data.props.availability.entitlements))
  },

  renderGroups(data) {
    return this.entitlementIds(data).map((id) => {
      return window.TimelineRenderGroup.renderGroup(data, this.groups(data)[id])
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


        </tbody>
      </table>
    )
  }



}
