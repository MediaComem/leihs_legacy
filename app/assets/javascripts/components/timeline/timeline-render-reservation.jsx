window.TimelineRenderReservation = {


  isStartReservationDay(rf, d) {
    return d.isSame(rf.startMoment, 'day')
  },

  isNoneReservationDay(rf, d) {
    return d.isBefore(rf.startMoment, 'day') || d.isAfter(rf.endMoment, 'day') && !rf.late
  },

  reservationColspan(rf, d, endBoundaryMoment) {

    if(rf.late) {
      return moment.duration(
        endBoundaryMoment.diff(rf.startMoment)
      ).asDays() + 1

    } else {
      return moment.duration(
        rf.endMoment.diff(rf.startMoment)
      ).asDays() + 1
    }

  },

  momentIso(d) {
    return d.format('YYYY-MM-DD')
  },

  findReservationFrame(rfs, d) {
    return _.find(rfs, (rf) => {
      return !this.isNoneReservationDay(rf, d)
    })
  },

  renderReservationFrameDay(rfs, d, endBoundaryMoment) {


    var rf = this.findReservationFrame(rfs, d)


    if(!rf) {

      var backgroundColor = 'none'
      if(d.isSame(moment(), 'day')) {
        backgroundColor = 'rgba(255, 0, 0, 0.1)'
      }

      return(
        <td key={'group_reservation_day_empty_' + this.momentIso(d)} style={{backgroundColor: backgroundColor, border: 'dotted black', borderWidth: '0px 1px 0px 0px'}}>
        </td>
      )
    } else if(this.isStartReservationDay(rf, d)) {

      var backgroundColor = '#adadad'
      if(rf.late) {
        backgroundColor = 'rgb(255, 100, 100)'
      } else if(!rf.itemId) {
        backgroundColor = 'rgb(102, 224, 224)'
      } else {
        backgroundColor = '#e3be1f'
      }


      return (
        <TimelineReservationBar
          key={'group_reservation_day_' + rf.rid + '_' + this.momentIso(d)}
          colSpan={this.reservationColspan(rf, d, endBoundaryMoment)}
          style={{border: 'dotted black', borderWidth: '0px 1px 0px 0px'}}
          innerStyle={{marginLeft: '2px', marginRight: '2px', backgroundColor: backgroundColor, fontSize: '12px', color: '#333', padding: '3px', borderRadius: '3px', /*overflow: 'hidden', width: ((40 * this.reservationColspan(rf, d)) + 'px'),*/ height: '20px', paddingLeft: '6px'}}
          reservationFrame={rf}
        />
      )

    } else {
      return (
        null
      )
    }
  },


  renderReservationFrameDays(data, fromDay, toDay, rfs, endBoundaryMoment) {
    return data.daysToShow.map((d) => {
      return this.renderReservationFrameDay(rfs, d, endBoundaryMoment)
    })
  }



}
