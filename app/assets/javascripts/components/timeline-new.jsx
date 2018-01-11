(() => {
  const React = window.React

  window.TimelineNew = window.createReactClass({
    propTypes: {
    },

    displayName: 'TimelineNew',

    isBefore(m1, m2) {
      return m1.isBefore(m2, 'day')
    },

    isAfter(m1, m2) {
      return m1.isAfter(m2, 'day')
    },

    findMaximumMoment(moments) {
      return _.reduce(
        moments,
        (memo, m) => {
          if(memo == null) {
            return m
          } else {
            if(this.isAfter(m, memo)) {
              return m
            } else {
              return memo
            }
          }
        },
        null
      )
    },

    findMinimumMoment(moments) {
      return _.reduce(
        moments,
        (memo, m) => {
          if(memo == null) {
            return m
          } else {
            if(this.isBefore(m, memo)) {
              return m
            } else {
              return memo
            }
          }
        },
        null
      )
    },

    mapToMoments(isoDates) {
      return isoDates.map(
        (iso) => moment(iso)
      )
    },

    reservationStartDates() {
      return this.props.timeline_availability.running_reservations.map(
        (rr) => rr.start_date
      )
    },

    reservationEndDates() {
      return this.props.timeline_availability.running_reservations.map(
        (rr) => rr.end_date
      )
    },

    firstReservationMoment() {
      return this.findMinimumMoment(
        this.mapToMoments(
          this.reservationStartDates()
        )
      )
    },

    lastReservationMoment() {
      return this.findMaximumMoment(
        this.mapToMoments(
          this.reservationEndDates()
        )
      )
    },

    numberOfDays(firstMoment, lastMoment) {
      return this.daysDifference(lastMoment, firstMoment) + 1
    },

    renderDays(firstMoment, numberOfDaysToShow) {

      return _.map(
        _.range(0, numberOfDaysToShow),
        (i) => {

          var m = moment(firstMoment).add(i, 'days')

          return (
            <div key={'day_' + i} style={{position: 'absolute', top: '0px', left: (i * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
              {m.format('DD')}
            </div>
          )
        }
      )


    },

    // getInitialState() {
    //   return {
    //     position: 0
    //   }
    // },
    //
    // componentDidMount() {
    //
    //   setInterval(
    //     () => {
    //       this.setState({position: this.state.position + 1})
    //     },
    //     30
    //   )
    // },

    daysDifference(m1, m2) {
      return moment.duration(
        m1.diff(m2)
      ).asDays()
    },

    findUser(timeline_availability, user_id) {
      return _.find(
        timeline_availability.reservation_users,
        (ru) => {
          return ru.id == user_id
        }
      )
    },

    username(timeline_availability, rr) {
      var u = this.findUser(timeline_availability, rr.user_id)
      var name = u.firstname
      if(u.lastname) {
        name += ' ' + u.lastname
      }
      return name
    },

    late(r) {
      return r.status == 'signed' &&


        !r.returned_date && this.isBefore(moment(r.end_date), moment())
    },


    reserved(r) {
      return this.isAfter(moment(r.start_date), moment()) && r.item_id
    },


    sortedReservations(reservations) {

      return _.sortBy(
        reservations,
        (r) => {
          var compare = ''
          if(!r.end_date || this.late(r)) {
            compare += '9999-99-99'
          } else {
            compare += r.end_date
          }
          compare += '/'
          if(!r.start_date) {
            compare += '0000-00-00'
          } else {
            compare += r.start_date
          }
          return compare
        }
      )
    },


    hasIntersection(rfs, rf) {

      return _.find(rfs, (rfi) => {

        var startA = moment(rf.start_date)
        var endA = moment(rf.end_date)
        var lateA = this.late(rf)//rf.late
        var reservedA = this.reserved(rf)//rf.reserved
        var startB = moment(rfi.start_date)
        var endB = moment(rfi.end_date)
        var lateB = this.late(rfi)//rfi.late
        var reservedB = this.reserved(rfi)//rfi.reserved

        if(!lateB && !reservedA && startA.isAfter(endB) || !lateA && !reservedB && startB.isAfter(endA)) {
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

    layoutReservationFrames(reservations) {

      var rfs = this.sortedReservations(reservations)


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
          return rfi.start_date
        })
      })

    },


    renderReservations(firstMoment, lastMoment, reservations, timeline_availability) {

      var layouted = this.layoutReservationFrames(reservations)


      return layouted.map((line, index) => {

        return line.map((rr) => {

          var start = moment(rr.start_date)
          var end = moment(rr.end_date)

          var offset = this.daysDifference(start, firstMoment)

          var length = this.numberOfDays(start, end)
          if(this.late(rr)) {
            length = this.numberOfDays(start, lastMoment)
          }

          console.log(start.format('DD-MM-YYYY')  + '   ' + end.format('DD-MM-YYYY') + '   ' + length)

          var height = 15

          return (
            <div key={'reservation_' + rr.id} style={{position: 'absolute', top: (index * height) + 'px', left: (offset * 30) + 'px', width: (length * 30) + 'px', height: height + 'px', border: '1px solid black'}}>
              <div>
                {this.username(timeline_availability, rr) /*+ ' ' + rr.id*/}
              </div>
            </div>
          )



        })

      })
    },

    signedReservations() {
      return _.filter(
        this.props.timeline_availability.running_reservations,
        (rr) => rr.status == 'signed'
      )
    },

    notSignedReservations() {
      return _.filter(
        this.props.timeline_availability.running_reservations,
        (rr) => rr.status != 'signed'
      )
    },

    render () {

      var firstMoment = this.firstReservationMoment()
      var lastMoment = this.lastReservationMoment()
      console.log(firstMoment)
      console.log(lastMoment)

      var numberOfDaysToShow = this.numberOfDays(firstMoment, lastMoment)
      console.log('numberOfDaysToShow = ' + numberOfDaysToShow)

      var dayWidth = 30

      var wholeWidth = dayWidth * numberOfDaysToShow

      return (
        <div style={{position: 'absolute', top: '0px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
          <div>Timeline New</div>

          <div style={{position: 'absolute', top: '100px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderDays(firstMoment, numberOfDaysToShow)}
          </div>
          <div style={{position: 'absolute', top: '200px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderReservations(firstMoment, lastMoment, this.signedReservations(), this.props.timeline_availability)}
          </div>
          <div style={{position: 'absolute', top: '1500px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderReservations(firstMoment, lastMoment, this.notSignedReservations(), this.props.timeline_availability)}
          </div>
        </div>
      )
    }
  })
})()
