window.TimelineRender = {

  momentMonthIso(d) {
    return d.format('YYYY-MM')
  },

  momentMonthHeader(fd) {
    return fd.format('MMM') + ' ' + fd.format('YYYY')
  },

  numberOfDaysToShow(data) {
    return moment.duration(
      data.endBoundaryMoment.diff(data.startBoundaryMoment)
    ).asDays()
  },

  daysToShowPerMonth(data, daysToShow, firstDayOfMonth) {
    return _.size(
      _.filter(daysToShow, (d) => {
        return this.momentMonthIso(d) == this.momentMonthIso(firstDayOfMonth)
      })
    )
  },

  daysToShow(data) {
    return _.range(0, this.numberOfDaysToShow(data)).map((d) => {
      return moment(data.startBoundaryMoment).add(d, 'days')
    })
  },

  firstDaysPerMonth(data) {
    return _.uniq(
      this.daysToShow(data), false, (d) => {
        return this.momentMonthIso(d)
      }
    )
  },

  renderMonths(data, daysToShow) {

    var backgroundColor = (fd) => {
      if(fd.month() % 2 == 1) {
        return '#aaa'
      } else {
        return '#ccc'
      }
    }

    return this.firstDaysPerMonth(data).map((fd) => {
      return (
        <td key={'month_' + this.momentMonthIso(fd)} colSpan={this.daysToShowPerMonth(data, daysToShow, fd)} style={{padding: '10px', backgroundColor: backgroundColor(fd), fontSize: '16px', textAlign: 'center'}}>{this.momentMonthHeader(fd)}</td>
      )
    })
  },






  renderDay(d) {
    return (
      <td key={'day_' + d.format('YYYY-MM-DD')} style={{padding: '10px', border: 'dotted black', borderWidth: '0px 1px 0px 0px', textAlign: 'center'}}>{d.format('DD')}</td>
    )
  },


  renderDays(data, daysToShow) {
    return daysToShow.map((d) => {
      return this.renderDay(d)
    })

  },







  renderTimeline(data) {

    var daysToShow = this.daysToShow(data)

    return (
      <table>
        <tbody>
          <tr>
            {this.renderMonths(data, daysToShow)}
          </tr>
          <tr>
            {this.renderDays(data, daysToShow)}
          </tr>


        </tbody>
      </table>
    )
  }



}
