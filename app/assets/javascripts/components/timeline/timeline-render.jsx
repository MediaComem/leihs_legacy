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



  renderGroupQuantities(data, visibleDaysToShow, groupId, label) {

    var groupQuantity = function(data, d) {
      return window.TimelineGroupCalc.groupQuantity(data, groupId, d)
    }

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      visibleDaysToShow,
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

  renderGroupQuantitiesTr(data, visibleDaysToShow, groupId, label) {
    return (
      <tr key={'group_quantities_' + groupId}>
        {this.renderGroupQuantities(data, visibleDaysToShow, groupId, label)}
      </tr>
    )
  },

  renderGroupReservationTr(data, visibleDaysToShow, rs, index) {
    return [
      <tr key='a'>
        {window.TimelineRenderHeader.renderEmpties(data, visibleDaysToShow, 0)}
      </tr>,
      <tr key={'group_reservation_line_' + index}>
        {window.TimelineRenderReservation.renderReservationFrameDays(data, visibleDaysToShow, rs)}
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

  renderGroupReservationTrs(data, visibleDaysToShow, groupId) {
    return this.layoutReservationFrames(data.reservationFrames[groupId]).map((rfs, index) => {
      return this.renderGroupReservationTr(data, visibleDaysToShow, rfs, index)
    })
  },


  renderGroup(data, visibleDaysToShow, groupId, label) {
    return [
      this.renderGroupQuantitiesTr(data, visibleDaysToShow, groupId, label),
      this.renderGroupReservationTrs(data, visibleDaysToShow, groupId)
    ]
  },

  renderGroups(data, visibleDaysToShow) {
    return this.entitlementIds(data).map((id) => {

      var groupId = id
      var label = (id ? ('Ausleihbar für Gruppe \'' + this.groups(data)[groupId].name + '\'') : ('Ausleihbar für alle'))

      return this.renderGroup(data, visibleDaysToShow, groupId, label)
      // return this.renderGroupAndReservations(this.groups()[id])
    })

  },

  // renderGroupsWithReservations(data) {
  //   this.renderGroups(data).concat(this.red)
  // },

  renderTotals(data, visibleDaysToShow) {

    return window.TimelineRenderStatistics.renderStatisticsLine(
      data,
      visibleDaysToShow,
      'Total ausleihbar',
      'total',
      window.TimelineTotalCalc.totalQuantity.bind(
        window.TimelineTotalCalc
      )
      // this.renderQuantity.bind(this)
    )


  },


  renderTimeline(data, visibleDaysToShow) {

    return (
      <div>
        <table>
          <tbody>
            <tr>
              {window.TimelineRenderHeader.renderMonths(data, visibleDaysToShow)}
            </tr>
            <tr>
              {window.TimelineRenderHeader.renderDays(data, visibleDaysToShow)}
            </tr>
            <tr>
              {this.renderTotals(data, visibleDaysToShow)}
            </tr>
            {this.renderGroups(data, visibleDaysToShow)}
            <tr>
              {window.TimelineRenderHeader.renderEmpties(data, visibleDaysToShow, 100)}
            </tr>
          </tbody>
        </table>
        {window.TimelineRenderDescription.renderDescription()}
      </div>
    )
  }



}
