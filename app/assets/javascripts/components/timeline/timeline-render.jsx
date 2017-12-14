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

  isStartReservationDay(rf, d) {
    return d.isSame(rf.startMoment, 'day')
  },

  isNoneReservationDay(rf, d) {
    return d.isBefore(rf.startMoment, 'day') || d.isAfter(rf.endMoment, 'day')
  },

  reservationColspan(rf, d) {
    return moment.duration(
      rf.endMoment.diff(rf.startMoment)
    ).asDays() + 1
  },

  momentIso(d) {
    return d.format('YYYY-MM-DD')
  },

  renderReservationFrameDay(rf, d) {

    if(this.isNoneReservationDay(rf, d)) {
      return(
        <td key={'group_reservation_day_' + rf.rid + '_' + this.momentIso(d)} style={{border: 'dotted black', borderWidth: '0px 1px 0px 0px'}}>
        </td>
      )
    } else if(this.isStartReservationDay(rf, d)) {
      return (
        <td key={'group_reservation_day_' + rf.rid + '_' + this.momentIso(d)} colSpan={this.reservationColspan(rf, d)} style={{padding: '5px 0px 5px 0px'}}>
          <div style={{backgroundColor: '#adadad', fontSize: '12px', color: '#333', padding: '3px', borderRadius: '3px', /*overflow: 'hidden', width: ((40 * this.reservationColspan(rf, d)) + 'px'),*/ height: '20px', paddingLeft: '6px'}}>
            {rf.username}
          </div>
        </td>
      )
    } else {
      return (
        null
      )
    }
  },


  renderReservationFrameDays(data, rf) {
    return data.daysToShow.map((d) => {
      return this.renderReservationFrameDay(rf, d)
    })
  },

  renderGroupReservationTr(data, r) {
    return (
      <tr key={'group_reservation_' + r.reservationId}>
        {this.renderReservationFrameDays(data, r)}
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
