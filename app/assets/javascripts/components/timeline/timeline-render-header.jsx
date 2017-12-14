window.TimelineRenderHeader = {

  momentMonthIso(d) {
    return d.format('YYYY-MM')
  },

  momentMonthHeader(fd) {
    return fd.format('MMM') + ' ' + fd.format('YYYY')
  },

  daysToShowPerMonth(data, firstDayOfMonth) {
    return _.size(
      _.filter(data.daysToShow, (d) => {
        return this.momentMonthIso(d) == this.momentMonthIso(firstDayOfMonth)
      })
    )
  },

  firstDaysPerMonth(data) {
    return _.uniq(
      data.daysToShow, false, (d) => {
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






  renderDay(d) {
    return (
      <td key={'day_' + d.format('YYYY-MM-DD')} style={{padding: '10px', border: 'dotted black', borderWidth: '0px 1px 0px 0px', textAlign: 'center'}}>{d.format('DD')}</td>
    )
  },


  renderDays(data) {
    return data.daysToShow.map((d) => {
      return this.renderDay(d)
    })

  }





}
