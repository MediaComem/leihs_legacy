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



  renderGroupQuantities(data, fromDay, toDay, groupId, label) {

    var groupQuantity = function(data, d) {
      return window.TimelineGroupCalc.groupQuantity(data, groupId, d)
    }

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      fromDay,
      toDay,
      label, //'Ausleihbar für Gruppe \'' + groupName + '\'',
      'group_' + groupId,
      groupQuantity
      // this.renderQuantity.bind(this)
    )
  },

  // renderGeneral(data) {
  //
  //   return (
  //     <tr key={'group_quantities_general'}>
  //       {this.renderGroupQuantities(data, null, 'Ausleihbar für alle')}
  //     </tr>
  //   )
  //
  // },

  renderGroupQuantitiesTr(data, fromDay, toDay, groupId, label) {
    return (
      <tr key={'group_quantities_' + groupId}>
        {this.renderGroupQuantities(data, fromDay, toDay, groupId, label)}
      </tr>
    )
  },

  renderGroupReservationTr(data, fromDay, toDay, rs, index) {
    return [
      <tr key='a'>
        {window.TimelineRenderHeader.renderEmpties(data, fromDay, toDay)}
      </tr>,
      <tr key={'group_reservation_line_' + index}>
        {window.TimelineRenderReservation.renderReservationFrameDays(data, fromDay, toDay, rs, data.endBoundaryMoment)}
      </tr>
    ]
  },

  hasIntersection(rfs, rf) {

    return _.find(rfs, (rfi) => {

      var startA = rf.startMoment
      var endA = rf.endMoment
      var lateA = rf.late
      var startB = rfi.startMoment
      var endB = rfi.endMoment
      var lateB = rfi.late

      if(!lateB && startA.isAfter(endB) || !lateA && startB.isAfter(endA)) {
        return false
      } else {
        return true
      }

    })

  },

  findNoneIntersectionLine(lines, rf) {
    return _.find(lines, (line) => {
      return !this.hasIntersection(line, rf)
    })
  },

  layoutReservationFrames(rfs) {


    return _.reduce(
      rfs,
      (memo, rf) => {

        if(memo.length == 0) {
          return memo.concat([[rf]])
        } else {

          var line = this.findNoneIntersectionLine(memo, rf)

          if(!line) {
            return memo.concat([[rf]])
          } else {
            line.push(rf)
            return memo
          }

        }
      },
      []
    ).map((line) => {
      return _.sortBy(line, (rfi) => {
        return rfi.startMoment.format('YYYY-MM-DD')
      })
    })

  },

  renderGroupReservationTrs(data, fromDay, toDay, groupId) {
    return this.layoutReservationFrames(data.reservationFrames[groupId]).map((rfs, index) => {
      return this.renderGroupReservationTr(data, fromDay, toDay, rfs, index)
    })
  },


  renderGroup(data, fromDay, toDay, groupId, label) {
    return [
      this.renderGroupQuantitiesTr(data, fromDay, toDay, groupId, label),
      this.renderGroupReservationTrs(data, fromDay, toDay, groupId)
    ]
  },

  renderGroups(data, fromDay, toDay) {
    return this.entitlementIds(data).map((id) => {

      var groupId = id
      var label = (id ? ('Ausleihbar für Gruppe \'' + this.groups(data)[groupId].name + '\'') : ('Ausleihbar für alle'))

      return this.renderGroup(data, fromDay, toDay, groupId, label)
      // return this.renderGroupAndReservations(this.groups()[id])
    })

  },

  // renderGroupsWithReservations(data) {
  //   this.renderGroups(data).concat(this.red)
  // },

  renderTotals(data, fromDay, toDay) {

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      fromDay,
      toDay,
      'Total ausleihbar',
      'total',
      window.TimelineTotalCalc.totalQuantity.bind(
        window.TimelineTotalCalc
      )
      // this.renderQuantity.bind(this)
    )


  },


  fromDay(data) {
    return data.firstChangeMoment
  },

  toDay(data) {
    return data.lastChangeMoment
  },


  renderTimeline(data) {

    return (
      <table>
        <tbody>
          <tr>
            {window.TimelineRenderHeader.renderMonths(data, this.fromDay(data), this.toDay(data))}
          </tr>
          <tr>
            {window.TimelineRenderHeader.renderDays(data, this.fromDay(data), this.toDay(data))}
          </tr>
          <tr>
            {this.renderTotals(data, this.fromDay(data), this.toDay(data))}
          </tr>
          {this.renderGroups(data, this.fromDay(data), this.toDay(data))}
        </tbody>
      </table>
    )
  }



}
