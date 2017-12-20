window.TimelineReadProps = {


  XXXavailability() {
    return this.props.availability
  },

  XXXchanges() {
    return this.XXXavailability().changes
  },

  unsortedChangesList() {
    return _.map(this.XXXchanges(), (value, key) => {
      return {
        moment: this.parseMoment(key),
        changes: value
      }
    })
  },

  changesList() {
    return _.sortBy(
      this.unsortedChangesList(),
      (v) => {
        return this.momentIso(v.moment)
      }
    )
  },

  firstChangeMoment(changesList) {
    return _.first(changesList).moment
  },

  lastChangeMoment(changesList) {
    return _.last(changesList).moment
  },


  momentIso(d) {
    return d.format('YYYY-MM-DD')
  },

  parseMoment(s) {
    return moment(s, 'YYYY-MM-DD', true)
  },

  firstReservationMoment() {

    return _.reduce(
      this.props.availability.running_reservations,
      (memo, rr) => {
        var d = this.parseMoment(rr.start_date)
        if(memo == null) {
          return d
        } else {
          if(d.isBefore(memo)) {
            return d
          } else {
            return memo
          }
        }
      },
      null
    )
  },

  lastReservationMoment() {

    return _.reduce(
      this.props.availability.running_reservations,
      (memo, rr) => {
        var d = this.parseMoment(rr.start_date)
        if(memo == null) {
          return d
        } else {
          if(d.isAfter(memo)) {
            return d
          } else {
            return memo
          }
        }
      },
      null
    )
  },


  startBoundaryMoment(firstChangeMoment, firstReservationMoment) {
    return moment(
      moment.min(
        firstChangeMoment,
        firstReservationMoment
      )
    ).add(- 1, 'month')
  },

  endBoundaryMoment(lastChangeMoment, lastReservationMoment) {
    return moment(
      moment.max(
        lastChangeMoment,
        lastReservationMoment
      )
    ).add(1, 'month')
  },








  XXXgroupKey(groupId) {
    if(!groupId) {
      return ''
    } else {
      return groupId
    }
  },


  flatReservationFrames(endBoundaryMoment) {

    return _.map(
      this.XXXavailability().running_reservations,

      (rr) => {

        var additionalInfo = _.find(
          this.props.running_reservations,
          (rr2) => {
            return rr2.id == rr.id
          }
        )

        var username = ''
        if(additionalInfo.user) {
          username += additionalInfo.user.firstname
          if(additionalInfo.user.lastname) {
            username += ' ' + additionalInfo.user.lastname
          }
        }

        return {
          reservationId: rr.id,
          startMoment: this.parseMoment(rr.start_date),
          late: additionalInfo.late,
          endMoment: (additionalInfo.late ? endBoundaryMoment : this.parseMoment(rr.end_date)),
          groupId: additionalInfo.group_id,
          username: username,
          itemId: rr.item_id
        }
      }
    )
  },

  groupedReservationFrames(endBoundaryMoment) {
    return _.groupBy(this.flatReservationFrames(endBoundaryMoment), 'groupId')
  },

  reservationFrames(endBoundaryMoment) {
    return _.mapObject(
      this.groupedReservationFrames(endBoundaryMoment),
      (reservations) => {
        return _.sortBy(
          reservations,
          (r) => {
            var compare = ''
            if(!r.endMoment) {
              compare += '0000-00-00'
            } else {
              compare += this.momentIso(r.endMoment)
            }
            compare += '/'
            if(!r.startMoment) {
              compare += '9999-99-99'
            } else {
              compare += this.momentIso(r.startMoment)
            }
            return compare
          }
        )
      }
    )
  },







  numberOfDaysToShow(startBoundaryMoment, endBoundaryMoment) {
    return moment.duration(
      endBoundaryMoment.diff(startBoundaryMoment)
    ).asDays()
  },

  daysToShow(startBoundaryMoment, numberOfDaysToShow) {
    return _.range(0, numberOfDaysToShow).map((d) => {
      return moment(startBoundaryMoment).add(d, 'days')
    })
  },


  readProps(props) {

    this.props = props

    var changesList = this.changesList()
    var firstChangeMoment = this.firstChangeMoment(changesList)
    var lastChangeMoment = this.lastChangeMoment(changesList)
    var firstReservationMoment = this.firstReservationMoment()
    var lastReservationMoment = this.lastReservationMoment()
    var startBoundaryMoment = this.startBoundaryMoment(firstChangeMoment, firstReservationMoment)
    var endBoundaryMoment = this.endBoundaryMoment(lastChangeMoment, lastReservationMoment)
    var reservationFrames = this.reservationFrames(endBoundaryMoment)
    var numberOfDaysToShow = this.numberOfDaysToShow(startBoundaryMoment, endBoundaryMoment)
    var daysToShow = this.daysToShow(startBoundaryMoment, numberOfDaysToShow)

    return {
      props: props,
      changesList: changesList,
      firstChangeMoment: firstChangeMoment,
      lastChangeMoment: lastChangeMoment,
      firstReservationMoment: firstReservationMoment,
      lastReservationMoment: lastReservationMoment,
      startBoundaryMoment: startBoundaryMoment,
      endBoundaryMoment: endBoundaryMoment,
      reservationFrames: reservationFrames,
      numberOfDaysToShow: numberOfDaysToShow,
      daysToShow: daysToShow
    }
  }


}
