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
      'Ausleihbar für Gruppe \'' + group.name + '\'',
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
      'Ausleihbar für alle',
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

  renderGroupQuantitiesTr(data, group) {
    return (
      <tr key={'group_quantities_' + group.id}>
        {this.renderGroupQuantities(data, group)}
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

  reservationFrameUsername(rf) {
    return 'test'
    // var u = this.reservationDetails(rf).user
    // return u.firstname + ' ' + (u.lastname ? u.lastname : '')
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
            {this.reservationFrameUsername(rf)}
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

  renderGroupReservationTrs(data, group) {
    return data.reservationFrames[group.id].map((r) => {
      return this.renderGroupReservationTr(data, r)
    })
  },


  renderGroup(data, group) {
    return [
      this.renderGroupQuantitiesTr(data, group),
      this.renderGroupReservationTrs(data, group)
    ]
  },

  renderGroups(data) {
    return this.entitlementIds(data).map((id) => {
      return this.renderGroup(data, this.groups(data)[id])
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
          {this.renderGeneral(data)}
        </tbody>
      </table>
    )
  }



}
