window.TimelineRenderStatistics = {

  // renderTotal(d) {
  //   return this.renderAnyQuantity(
  //     'Total verfügbar',
  //     d,
  //     'day_' + this.fullFormat(d),
  //     this.totalQuantity(d)
  //   )
  // },

  isLabelTd(data, day) {
    return day.isSame(data.startBoundaryMoment)
  },

  isDayCoverdByLabel(data, day) {
    return day.isBefore(this.startBoundaryMoment)
  },

  labelColspan(data) {
    return moment.duration(
      data.firstChangeMoment.diff(data.startBoundaryMoment)
    ).asDays()
  },

  renderLabelTd(data, label, lineKey, colSpan) {

    var tdStyle = {
      padding: '5px',
      paddingTop: '30px',
      paddingBottom: '30px'
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


  sumQuantities(change) {
    return _.reduce(
      _.values(change),
      (memo, c) => {
        return memo + c.in_quantity
      },
      0
    )
  },


  findInChangesList(data, d) {
    var r = _.last(
      _.filter(
        data.changesList,
        (p) => {
          return !d.isBefore(p.moment, 'day')
        }
      )
    )

    if(!r) {
      return r
    }

    if(d.isAfter(data.lastChangeMoment)) {
      return null
    } else {
      return r
    }
  },


  findChangesForDay(data, d) {
    var foundChanges = this.findInChangesList(data, d)
    if(foundChanges) {
      return foundChanges.changes
    } else {
      null
    }
  },


  totalQuantity(data, d) {
    var changesForDay = this.findChangesForDay(data, d)
    if(changesForDay) {
      return this.sumQuantities(changesForDay)
    } else {
      return null
    }
  },


  renderQuantity(data, day, lineKey) {

    var value = this.totalQuantity(data, day)

    var tdStyle = {
      padding: '5px',
      paddingTop: '30px',
      border: 'dotted black',
      borderWidth: '0px 1px 0px 0px',
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


  renderStatisticsLine(data, label, lineKey, renderQuantity) {
    return _.compact(
      data.daysToShow.map(
        (day) => {

          if(this.isLabelTd(data, day)) {
            var colSpan = this.labelColspan(data)
            return this.renderLabelTd(data, label, lineKey, colSpan)
          } else if(this.isDayCoverdByLabel(data, day)) {
            return null
          } else {
            return renderQuantity(data, day, lineKey)
          }
        }
      )
    )
  },


  renderTotals(data) {

    return this.renderStatisticsLine(
      data,
      'Total verfügbar',
      'total',
      this.renderQuantity.bind(this)
    )


  }
}
