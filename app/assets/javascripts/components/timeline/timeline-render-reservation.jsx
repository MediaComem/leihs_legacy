window.TimelineRenderReservation = {


  isStartReservationDay(rf, d) {
    return d.isSame(rf.startMoment, 'day')
  },

  isNoneReservationDay(rf, d) {
    return d.isBefore(rf.startMoment, 'day') || d.isAfter(rf.endMoment, 'day')
  },

  reservationColspan(rf, d) {
    return moment.duration(
      rf.endMoment.diff(rf.startMoment)
    ).asDays() + 1
  },

  momentIso(d) {
    return d.format('YYYY-MM-DD')
  },

  findReservationFrame(rfs, d) {
    return _.find(rfs, (rf) => {
      return !this.isNoneReservationDay(rf, d)
    })
  },

  renderReservationFrameDay(rfs, d) {


    var rf = this.findReservationFrame(rfs, d)


    if(!rf) {
      return(
        <td key={'group_reservation_day_empty_' + this.momentIso(d)} style={{border: 'dotted black', borderWidth: '0px 1px 0px 0px'}}>
        </td>
      )
    } else if(this.isStartReservationDay(rf, d)) {
      return (
        <td key={'group_reservation_day_' + rf.rid + '_' + this.momentIso(d)} colSpan={this.reservationColspan(rf, d)} style={{padding: '5px 0px 5px 0px'}}>
          <div style={{backgroundColor: '#adadad', fontSize: '12px', color: '#333', padding: '3px', borderRadius: '3px', /*overflow: 'hidden', width: ((40 * this.reservationColspan(rf, d)) + 'px'),*/ height: '20px', paddingLeft: '6px'}}>
            {rf.username}
          </div>
        </td>
      )
    } else {
      return (
        null
      )
    }
  },


  renderReservationFrameDays(data, rf) {
    return data.daysToShow.map((d) => {
      return this.renderReservationFrameDay([rf], d)
    })
  }



}
