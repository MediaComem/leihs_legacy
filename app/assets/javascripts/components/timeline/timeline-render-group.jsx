window.TimelineRenderGroup = {


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


  renderGroup(data, group) {

    return (
      <tr key={'group_quantities_' + group.id}>
        {this.renderGroupQuantities(data, group)}
      </tr>
    )

  }
}
