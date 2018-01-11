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
              memo
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
              memo
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


    renderReservations(firstMoment, timeline_availability) {

      return timeline_availability.running_reservations.map((rr, index) => {

        var start = moment(rr.start_date)
        var end = moment(rr.end_date)

        var offset = this.daysDifference(start, firstMoment)
        var length = this.daysDifference(end, start)
        console.log(start.format('DD-MM-YYYY')  + '   ' + end.format('DD-MM-YYYY') + '   ' + length)


        return (
          <div key={'reservation_' + index} style={{position: 'absolute', top: (index * 30) + 'px', left: (offset * 30) + 'px', width: (length * 30) + 'px', height: '30px', border: '1px solid black'}}>
            <div>
              {this.username(timeline_availability, rr)}
            </div>
          </div>
        )

      })
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
            {this.renderReservations(firstMoment, this.props.timeline_availability)}
          </div>
        </div>
      )
    }
  })
})()
