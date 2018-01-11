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


    offset(firstMoment) {
      return this.daysDifference(moment(), firstMoment)
    },

    renderTitle(firstMoment, relevantItemsCount) {

      var offset = this.offset(firstMoment)


      return (
        <div style={{fontSize: '16px', position: 'absolute', top: '0px', left: (offset * 30) + 'px', textAlign: 'left', width: '1000px', height: '30px', border: '0px'}}>
          {'Nutzbare Gegenstände: ' + relevantItemsCount}
        </div>
      )
    },

    renderLabel(firstMoment, text) {

      var offset = this.offset(firstMoment)


      return (
        <div style={{fontSize: '16px', position: 'absolute', top: '0px', left: (offset * 30 - 1000 - 20) + 'px', textAlign: 'right', width: '1000px', height: '30px', border: '0px'}}>
          {text}
        </div>
      )
    },

    renderLabelSmall(firstMoment, text) {

      var offset = this.offset(firstMoment)


      return (
        <div style={{fontSize: '10px', padding: '4px', margin: '2px', position: 'absolute', top: '0px', left: (offset * 30 - 1000 - 10) + 'px', textAlign: 'right', width: '1000px', height: '30px', border: '0px'}}>
          {text}
        </div>
      )
    },

    renderTotals(firstMoment, numberOfDaysToShow, relevantItemsCount) {

      return _.map(
        _.range(0, numberOfDaysToShow),
        (i) => {

          var m = moment(firstMoment).add(i, 'days')

          var value = ''

          if(m.isSameOrAfter(moment(), 'day')) {
            value = '' + relevantItemsCount
          }

          return (
            <div key={'total_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: (i * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
              {value}
            </div>
          )
        }
      )
    },

    renderValue(prefix, index, offset, value, backgroundColor) {
      return (
        <div key={prefix + index} style={{position: 'absolute', top: '0px', left: ((offset + index) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          <div style={{backgroundColor: backgroundColor, textAlign: 'center', fontSize: '16px', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', padding: '4px', margin: '2px', borderRadius: '5px'}}>
            {value}
          </div>
        </div>
      )

    },

    renderValueSmall(prefix, index, offset, value, backgroundColor) {
      return (
        <div key={prefix + index} style={{position: 'absolute', top: '0px', left: ((offset + index) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          <div style={{textAlign: 'center', fontSize: '10px', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', padding: '4px', margin: '2px'}}>
            {value}
          </div>
        </div>
      )

    },

    renderQuantities(handoutCounts, firstMoment, lastMoment, colors) {

      var offset = this.offset(firstMoment)

      return _.map(
        handoutCounts,
        (hc, i) => {

          var value = hc

          var color = colors(value)

          return this.renderValue('handout_count_', i, offset, value, color)
          // return (
          //   <div key={'handout_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: ((offset + i) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          //     {value}
          //   </div>
          // )
        }
      )
    },

    renderIndexedQuantities(valueFunc, firstMoment, lastMoment, colorFunc) {

      var offset = this.offset(firstMoment)

      var range = _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      )

      return _.map(
        range,
        (i) => {

          var value = valueFunc(i)

          var color = colorFunc(i)

          return this.renderValue('handout_count_', i, offset, value, color)
          // return (
          //   <div key={'handout_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: ((offset + i) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          //     {value}
          //   </div>
          // )
        }
      )
    },

    renderIndexedQuantitiesSmall(valueFunc, firstMoment, lastMoment, colorFunc) {

      var offset = this.offset(firstMoment)

      var range = _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      )

      return _.map(
        range,
        (i) => {

          var value = valueFunc(i)

          var color = colorFunc(i)

          return this.renderValueSmall('handout_count_', i, offset, value, color)
          // return (
          //   <div key={'handout_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: ((offset + i) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          //     {value}
          //   </div>
          // )
        }
      )
    },

    renderBorrowableQuantities(handoutCounts, firstMoment, lastMoment, relevantItemsCount) {

      var offset = this.offset(firstMoment)

      return _.map(
        handoutCounts,
        (hc, i) => {

          var value = relevantItemsCount - hc

          return (
            <div key={'handout_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: ((offset + i) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
              {value}
            </div>
          )
        }
      )
    },

    renderDays(firstMoment, numberOfDaysToShow) {

      return _.map(
        _.range(0, numberOfDaysToShow),
        (i) => {

          var m = moment(firstMoment).add(i, 'days')

          return (
            <div key={'day_' + i} style={{position: 'absolute', top: '0px', left: (i * 30) + 'px', width: '30px', bottom: '0px', border: '0px'}}>
              <div style={{position :'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px', border: '1px dotted black', borderWidth: '0px 1px 0px 0px'}}>
                {m.format('DD')}
              </div>
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
      return Math.floor(
        moment.duration(
          m1.diff(m2)
        ).asDays()
      )
    },

    findUser(timeline_availability, user_id) {
      return _.find(
        timeline_availability.reservation_users,
        (ru) => {
          return ru.id == user_id
        }
      )
    },

    reservationLabel(timeline_availability, rr) {

      var label = this.username(timeline_availability, rr)

      var inventoryCode = this.inventoryCode(timeline_availability, rr)
      if(inventoryCode) {
        label += ' ' + inventoryCode
      }

      return label
    },

    username(timeline_availability, rr) {
      var u = this.findUser(timeline_availability, rr.user_id)
      var name = u.firstname
      if(u.lastname) {
        name += ' ' + u.lastname
      }
      return name
    },

    inventoryCode(timeline_availability, rr) {

      if(!rr.item_id) {
        return null
      }

      return _.find(
        timeline_availability.items,
        (i) => i.id == rr.item_id
      ).inventory_code


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

        if(!lateB && !reservedA && this.isAfter(startA, endB) || !lateA && !reservedB && this.isAfter(startB, endA)) {
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

    calcReservationsHeight(reservations) {

      var layouted = this.layoutReservationFrames(reservations)
      return layouted.length * 20

    },


    renderReservations(firstMoment, lastMoment, reservations, timeline_availability) {

      var layouted = this.layoutReservationFrames(reservations)


      return layouted.map((line, index) => {

        return line.map((rr) => {

          var start = moment(rr.start_date)
          var end = moment(rr.end_date)

          var offset = this.daysDifference(start, firstMoment)

          var height = 15
          var padding = 5
          var totalHeight = height + padding




          if(this.late(rr)) {
            var length = this.numberOfDays(start, end)
            var lateLength = this.numberOfDays(start, lastMoment) - length


            // background-color: gray;
            // background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,255,.5) 50%);
            // background-size: 50px 50px;

            // http://lea.verou.me/css3patterns/#diagonal-stripes
            return [
              <div key={'reservation_' + rr.id} style={{position: 'absolute', top: (index * totalHeight) + 'px', left: (offset * 30 + length * 30) + 'px', width: (lateLength * 30) + 'px', height: height + 'px', border: '0px'}}>
                <div style={{position: 'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px', backgroundColor: 'red', borderRadius: '0px 5px 5px 0px', padding: '2px 5px', margin: '0px 3px 0px 0px', backgroundColor: '#ffeea6', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 25px, #e3be1f 25px, #e3be1f 50px)'}}>
                  {' '}
                </div>
              </div>
              ,
              <div key={'reservation_' + rr.id} style={{position: 'absolute', top: (index * totalHeight) + 'px', left: (offset * 30) + 'px', width: (length * 30) + 'px', height: height + 'px', border: '0px'}}>
                <div style={{position: 'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px', backgroundColor: '#e3be1f', borderRadius: '5px 0px 0px 5px', padding: '2px 5px', margin: '0px 0px 0px 3px'}}>
                  {this.reservationLabel(timeline_availability, rr) /*+ ' ' + rr.id*/}
                </div>
              </div>
            ]

          } else {

            var length = this.numberOfDays(start, end)

            return (
              <div key={'reservation_' + rr.id} style={{position: 'absolute', top: (index * totalHeight) + 'px', left: (offset * 30) + 'px', width: (length * 30) + 'px', height: height + 'px', border: '0px'}}>
                <div style={{backgroundColor: '#e3be1f', borderRadius: '5px', padding: '2px 5px', margin: '0px 3px'}}>
                  {this.reservationLabel(timeline_availability, rr) /*+ ' ' + rr.id*/}
                </div>
              </div>
            )
          }




        })

      })
    },

    relevantItems() {
      return _.filter(
        this.props.timeline_availability.items,
        (i) => {
          return i.is_borrowable && !i.is_broken && !i.retired
        }
      )
    },

    relevantItemsCount() {
      return this.relevantItems().length
    },

    reservationIntersectsDay(rf, day) {



      var start = moment(rf.start_date)
      var end = moment(rf.end_date)
      var late = this.late(rf)
      var reserved = this.reserved(rf)


      if(!reserved && this.isAfter(start, day) || !late && this.isAfter(day, end)) {
        return false
      } else {
        return true
      }


    },

    reservationsForDay(timeline_availability, day) {

      return _.filter(
        timeline_availability.running_reservations,
        (r) => this.reservationIntersectsDay(r, day)
      )



    },


    reservationCounts(timeline_availability, lastMoment) {

      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {

        var day = moment().add(i, 'days')
        return _.filter(
          this.reservationsForDay(timeline_availability, day),
          (r) => {
            return r.status != 'signed'
          }
        )

      })
    },


    totalCounts(lastMoment, relevantItemsCount) {
      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {
        return relevantItemsCount
      })
    },


    handoutCounts(timeline_availability, lastMoment) {

      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {

        var day = moment().add(i, 'days')
        return _.filter(
          this.reservationsForDay(timeline_availability, day),
          (r) => {
            return r.status == 'signed'
          }
        )

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

    usableColors(index) {
      return 'rgb(210, 210, 210)'
    },

    handoutColors(index) {
      return 'rgb(210, 210, 210)'
    },

    reservationColors(index) {
      return 'rgb(210, 210, 210)'
      // return 'rgb(170, 221, 170)'
    },

    borrowableColors(index) {
      return 'rgb(210, 210, 210)'
      // return 'rgb(170, 221, 170)'
    },

    render () {

      var firstMoment = this.firstReservationMoment()
      var lastMoment = this.lastReservationMoment()

      var numberOfDaysToShow = this.numberOfDays(firstMoment, lastMoment)

      var dayWidth = 30

      var relevantItemsCount = this.relevantItemsCount()

      var totalCounts = this.totalCounts(lastMoment, relevantItemsCount)


      var handoutCounts = this.handoutCounts(this.props.timeline_availability, lastMoment).map((hc) => - hc.length)

      var borrowableCounts = _.zip(totalCounts, handoutCounts).map((p) => _.first(p) + _.last(p))

      var reservationCounts = this.reservationCounts(this.props.timeline_availability, lastMoment).map((rc) => - rc.length)

      var unusedCounts = _.zip(borrowableCounts, reservationCounts).map((p) => _.first(p) + _.last(p))

      var wholeWidth = dayWidth * numberOfDaysToShow

      var unusedColors = (index) => {
        var delta = unusedCounts[index]
        if(delta > 0) {
          return 'rgb(170, 221, 170)'
        } else if(delta == 0) {
          return 'rgb(232, 147, 37)'
        } else {
          return 'rgb(221, 170, 170)'
        }
      }

      var topHandoutLines = 130

      var topTitle = 40

      var topTotal = 100

      var topAfterHandoutLines = topHandoutLines + this.calcReservationsHeight(this.signedReservations())

      var topReservationLines = topAfterHandoutLines + 100

      var topAfterReservationLines = topReservationLines + this.calcReservationsHeight(this.notSignedReservations())

      var topFreeItems = topAfterReservationLines + 80

      var wholeHeight = topFreeItems + 200

      // <div style={{position: 'absolute', top: (topAfterHandoutLines + 55) + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
      //   {this.renderLabelSmall(firstMoment, 'Ausleihbar')}
      //   {this.renderIndexedQuantitiesSmall((i) => borrowableCounts[i], firstMoment, lastMoment, this.borrowableColors)}
      // </div>


      return (
        <div style={{position: 'absolute', top: '0px', left: '0px', height: wholeHeight + 'px', width: wholeWidth + 'px', bottom: '0px'}}>
          <div style={{position: 'absolute', top: '0px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderDays(firstMoment, numberOfDaysToShow, wholeHeight)}
          </div>
          <div style={{position: 'absolute', top: topTitle + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            <div style={{position: 'absolute', top: '0px', left: '0px', right: '0px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.7)'}} />
            {this.renderTitle(firstMoment, relevantItemsCount)}
          </div>
          <div style={{position: 'absolute', top: topTotal + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderLabelSmall(firstMoment, 'Total')}
            {this.renderIndexedQuantitiesSmall((i) => totalCounts[i], firstMoment, lastMoment, this.handoutColors)}
          </div>
          <div style={{position: 'absolute', top: topAfterHandoutLines + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderLabelSmall(firstMoment, 'Ausgehändigt')}
            {this.renderIndexedQuantitiesSmall((i) => handoutCounts[i], firstMoment, lastMoment, this.handoutColors)}
          </div>
          <div style={{position: 'absolute', top: topHandoutLines + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderReservations(firstMoment, lastMoment, this.signedReservations(), this.props.timeline_availability)}
          </div>
          <div style={{position: 'absolute', top: topReservationLines + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderReservations(firstMoment, lastMoment, this.notSignedReservations(), this.props.timeline_availability)}
          </div>
          <div style={{position: 'absolute', top: topAfterReservationLines + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderLabelSmall(firstMoment, 'Reservationen')}
            {this.renderIndexedQuantitiesSmall((i) => reservationCounts[i], firstMoment, lastMoment, this.reservationColors)}
          </div>
          <div style={{position: 'absolute', top: topFreeItems + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderLabel(firstMoment, 'Freie Gegenstände')}
            {this.renderIndexedQuantities((i) => unusedCounts[i], firstMoment, lastMoment, unusedColors)}
          </div>
        </div>
      )
    }
  })
})()
