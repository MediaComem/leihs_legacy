window.TimelineRenderHeader = {

  momentMonthIso(d) {
    return d.format('YYYY-MM')
  },

  momentMonthHeader(fd) {
    return fd.format('MMM') + ' ' + fd.format('YYYY')
  },

  daysToShowPerMonth(data, firstDayOfMonth, visibleDaysToShow) {
    return _.size(
      _.filter(visibleDaysToShow, (d) => {
        return this.momentMonthIso(d) == this.momentMonthIso(firstDayOfMonth)
      })
    )
  },

  firstDaysPerMonth(data, visibleDaysToShow) {
    return _.uniq(
      visibleDaysToShow, false, (d) => {
        return this.momentMonthIso(d)
      }
    )
  },

  renderMonths(data, visibleDaysToShow) {

    var backgroundColor = (fd) => {
      if(fd.month() % 2 == 1) {
        return '#aaa'
      } else {
        return '#ccc'
      }
    }

    return this.firstDaysPerMonth(data, visibleDaysToShow).map((fd) => {
      return (
        <td key={'month_' + this.momentMonthIso(fd)} colSpan={this.daysToShowPerMonth(data, fd, visibleDaysToShow)} style={{padding: '10px', backgroundColor: backgroundColor(fd), fontSize: '16px', textAlign: 'center'}}>{this.momentMonthHeader(fd)}</td>
      )
    })
  },



  renderEmpty(d) {
    var backgroundColor = 'none'
    if(d.isSame(moment(), 'day')) {
      backgroundColor = 'rgba(255, 0, 0, 0.1)'
    }


    return (
      <td key={'day_empty_' + d.format('YYYY-MM-DD')} style={{backgroundColor: backgroundColor, padding: '3px', border: 'dotted black', borderWidth: '0px 1px 0px 0px', textAlign: 'center'}}></td>
    )
  },

  renderEmpties(data, visibleDaysToShow) {
    return visibleDaysToShow.map((d) => {
      return this.renderEmpty(d)
    })

  },



  renderDay(d) {
    var id = null
    var backgroundColor = 'none'
    if(d.isSame(moment(), 'day')) {
      id = 'timeline_today'
      backgroundColor = 'rgba(255, 0, 0, 0.1)'
    }


    return (
      <td id={id} key={'day_' + d.format('YYYY-MM-DD')} style={{backgroundColor: backgroundColor, padding: '10px', border: 'dotted black', borderWidth: '0px 1px 0px 0px', textAlign: 'center'}}>{d.format('DD')}</td>
    )
  },


  renderDays(data, visibleDaysToShow) {
    return visibleDaysToShow.map((d) => {
      return this.renderDay(d)
    })

  }





}
