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

  // renderGeneral(data) {
  //
  //   return (
  //     <tr key={'group_quantities_general'}>
  //       {this.renderGroupQuantities(data, null, 'Ausleihbar für alle')}
  //     </tr>
  //   )
  //
  // },

  renderGroupQuantitiesTr(data, groupId, label) {
    return (
      <tr key={'group_quantities_' + groupId}>
        {this.renderGroupQuantities(data, groupId, label)}
      </tr>
    )
  },

  renderGroupReservationTr(data, rs, index) {
    return (
      <tr key={'group_reservation_line_' + index}>
        {window.TimelineRenderReservation.renderReservationFrameDays(data, rs)}
      </tr>
    )
  },

  hasIntersection(rfs, rf) {

    return _.find(rfs, (rfi) => {

      var startA = rf.startMoment
      var endA = rf.endMoment
      var startB = rfi.startMoment
      var endB = rfi.endMoment

      if(startA.isAfter(endB) || startB.isAfter(endA)) {
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

  renderGroupReservationTrs(data, groupId) {
    return this.layoutReservationFrames(data.reservationFrames[groupId]).map((rfs, index) => {
      return this.renderGroupReservationTr(data, rfs, index)
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