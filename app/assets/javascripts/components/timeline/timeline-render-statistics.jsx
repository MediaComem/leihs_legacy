window.TimelineRenderStatistics = {

  // renderTotal(d) {
  //   return this.renderAnyQuantity(
  //     'Total verfügbar',
  //     d,
  //     'day_' + this.fullFormat(d),
  //     this.totalQuantity(d)
  //   )
  // },

  isLabelTd(data, day, fromDay) {
    return day.isSame(fromDay)//data.startBoundaryMoment)
  },

  isDayCoverdByLabel(data, day) {
    return day.isBefore(data.firstChangeMoment, 'day')
  },

  labelColspan(data, fromDay) {
    return moment.duration(
      data.firstChangeMoment.diff(fromDay)
    ).asDays()
  },

  renderLabelTd(data, label, lineKey, colSpan) {

    var tdStyle = {
      padding: '5px',
      paddingTop: '30px',
      paddingBottom: '30px',
      border: 'dotted black',
      borderWidth: '0px 1px 0px 0px'
    }

    var divStyle = {
      fontSize: '14px',
      textAlign: 'right',
      height: '30px',
      paddingTop: '6px',
      paddingRight: '20px'
    }

    var key = 'label_' + lineKey

    return (
      <td key={key} colSpan={colSpan} style={tdStyle}>
        <div style={divStyle}>
          {label}
        </div>
      </td>
    )
  },


  renderQuantity(data, day, lineKey, calculateQuantity) {

    var value = calculateQuantity(data, day)

    var backgroundColor = 'none'
    if(day.isSame(moment(), 'day')) {
      backgroundColor = 'rgba(255, 0, 0, 0.1)'
    }

    var tdStyle = {
      padding: '5px',
      paddingTop: '30px',
      border: 'dotted black',
      borderWidth: '0px 1px 0px 0px',
      backgroundColor: backgroundColor
    }



    var signal = '#ada'
    if(value != null && value != undefined && value < 0) {
      signal = '#daa'
    }

    var divStyle = {
      fontSize: '14px',
      backgroundColor: signal,
      borderRadius: '5px',
      textAlign: 'center',
      width: '30px',
      height: '30px',
      paddingTop: '6px'
    }

    var hiddenStyle = {
      width: '30px',
      height: '30px',
      paddingTop: '6px'
    }

    var key = lineKey + '_day_' + day.format('YYYY-MM-DD')

    if(value != null && value != undefined) {
      return (
        <td key={key} style={tdStyle}>
          <div style={divStyle}>{value}</div>
        </td>
      )
    } else {
      return (
        <td key={key} style={tdStyle}>
          <div style={hiddenStyle}>{value}</div>
        </td>
      )
    }
  },


  renderStatisticsLine(data, visibleDaysToShow, label, lineKey, calculateQuantity) {
    return _.compact(
      visibleDaysToShow.map(
        (day) => {

          if(this.isLabelTd(data, day, visibleDaysToShow[0])) {
            var colSpan = this.labelColspan(data, visibleDaysToShow[0])
            return this.renderLabelTd(data, label, lineKey, colSpan)
          } else if(this.isDayCoverdByLabel(data, day)) {
            return null
          } else {
            return this.renderQuantity(data, day, lineKey, calculateQuantity)
          }
        }
      )
    )
  }


}
