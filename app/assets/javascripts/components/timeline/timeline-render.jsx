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

  daysToShowPerMonth(data, firstDayOfMonth) {
    return _.size(
      _.filter(this.daysToShow(data), (d) => {
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

  renderMonths(data) {

    var backgroundColor = (fd) => {
      if(fd.month() % 2 == 1) {
        return '#aaa'
      } else {
        return '#ccc'
      }
    }

    return this.firstDaysPerMonth(data).map((fd) => {
      return (
        <td key={'month_' + this.momentMonthIso(fd)} colSpan={this.daysToShowPerMonth(data, fd)} style={{padding: '10px', backgroundColor: backgroundColor(fd), fontSize: '16px', textAlign: 'center'}}>{this.momentMonthHeader(fd)}</td>
      )
    })
  },

  renderTimeline(data) {
    return (
      <table>
        <tbody>
          <tr>
            {this.renderMonths(data)}
          </tr>


        </tbody>
      </table>
    )
  }



}
