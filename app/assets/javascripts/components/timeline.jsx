(() => {
  const React = window.React

  window.Timeline = window.createReactClass({
    propTypes: {
    },

    displayName: 'Timeline',

    availability() {
      return this.props.availability
    },

    changes() {
      return this.availability().changes
    },

    changesAsStringDatesSorted() {
      return Object.keys(this.changes()).sort()
    },

    pairsMomentWithChange() {
      return this.changesAsStringDatesSorted().map((sd) => {
        return [
          this.parseFull(sd),
          this.changes()[sd]
        ]
      })
    },

    // changesAsMomentsSorted() {
    //   return _.sortBy(
    //     this.changesAsMoments(),
    //     (m) => {
    //       m.format('YYYYMMDD');
    //     }
    //   )
    // },


    firstReservationDayAsMoment() {

      if(this.firstReservationDayAsMomentCache) {
        return this.firstReservationDayAsMomentCache
      }

      var mom = _.reduce(
        this.props.availability.running_reservations,
        (memo, rr) => {
          var d = this.parseFull(rr.start_date)
          if(memo == null) {
            return d
          } else {
            if(d.isBefore(memo, 'day')) {
              return d
            } else {
              return memo
            }
          }
        },
        null
      )


      this.firstReservationDayAsMomentCache = mom

      return mom
    },


    lastReservationDayAsMoment() {


      if(this.lastReservationDayAsMomentCache) {
        return this.lastReservationDayAsMomentCache
      }

      var mom = _.reduce(
        this.props.availability.running_reservations,
        (memo, rr) => {
          var d = this.parseFull(rr.end_date)
          if(memo == null) {
            return d
          } else {
            if(d.isBefore(memo, 'day')) {
              return d
            } else {
              return memo
            }
          }
        },
        null
      )


      this.lastReservationDayAsMomentCache = mom

      return mom

    },

    firstChangeAsMoment() {
      return _.first(_.first(this.pairsMomentWithChange()))
    },

    lastChangeAsMoment() {
      return _.first(_.last(this.pairsMomentWithChange()))
    },

    // monthBeforefirstChange() {
    //   return moment(this.firstChangeAsMoment()).add(- 1, 'month')
    // },
    //
    // monthAfterFirstChange() {
    //   return moment(this.lastChangeAsMoment()).add(1, 'month')
    // },

    firstDateToShow() {
      return moment(
        moment.min(
          this.firstChangeAsMoment(),
          this.firstReservationDayAsMoment()
        )
      ).add(- 1, 'month')
    },

    lastDateToShow() {
      return moment(
        moment.max(
          this.lastChangeAsMoment(),
          this.lastReservationDayAsMoment()
        )
      ).add(1, 'month')
    },

    numberOfDaysToShow() {
      return moment.duration(
        this.lastDateToShow().diff(this.firstDateToShow())
      ).asDays()
    },

    daysToShow() {
      return _.range(0, this.numberOfDaysToShow()).map((d) => {
        return moment(this.firstDateToShow()).add(d, 'days')
      })
    },

    firstDaysPerMonthToShow() {

      return _.uniq(
        this.daysToShow(), false, (d) => {
          return d.format('YYYY-MM')
        }
      )
    },

    daysToShowPerMonth(firstDayOfMonth) {
      return _.size(
        _.filter(this.daysToShow(), (d) => {
          return d.format('YYYY-MM') == firstDayOfMonth.format('YYYY-MM')
        })
      )
    },

    fullFormat(d) {
      return d.format('YYYY-MM-DD')
    },

    parseFull(s) {
      return moment(s, 'YYYY-MM-DD', true)
    },

    renderMonths() {

      var backgroundColor = (fd) => {
        if(fd.month() % 2 == 1) {
          return '#aaa'
        } else {
          return '#ccc'
        }
      }

      return this.firstDaysPerMonthToShow().map((fd) => {
        return (
          <td key={'month_' + fd.format('YYYY-MM')} colSpan={this.daysToShowPerMonth(fd)} style={{padding: '10px', backgroundColor: backgroundColor(fd), fontSize: '16px', textAlign: 'center'}}>{fd.format('MMM') + ' ' + fd.format('YYYY')}</td>
        )
      })

      // var r = _.partition(this.daysToShow(), (d) => {
      //   return d.format('YYYY-MM')
      // })
      //
      // debugger
      // return r;
    },

    renderDay(d) {
      return (
        <td key={'day_' + this.fullFormat(d)} style={{padding: '10px', border: 'dotted black', borderWidth: '0px 1px 0px 0px', textAlign: 'center'}}>{d.format('DD')}</td>
      )
    },

    renderDays() {
      return this.daysToShow().map((d) => {
        return this.renderDay(d)
      })
    },

    findPairMomentWithChangeForDay(d) {
      var r = _.last(
        _.filter(
          this.pairsMomentWithChange(),
          (p) => {
            return !d.isBefore(_.first(p), 'day')
          }
        )
      )

      if(!r) {
        return r
      }

      console.log('find change for day ' + _.first(r).format('YYYY-MM-DD') + ' ' + this.lastChangeAsMoment().format('YYYY-MM-DD'))

      if(d.isAfter(this.lastChangeAsMoment())) {
        return null
      } else {
        return r
      }
    },

    findChangeForDay(d) {
      if(this.findPairMomentWithChangeForDay(d)) {
        return _.last(this.findPairMomentWithChangeForDay(d))
      } else {
        null
      }
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

    totalQuantity(d) {
      console.log('total quantity ' + d.format('YYYY-MM-DD'))
      if(this.findChangeForDay(d)) {
        return this.sumQuantities(this.findChangeForDay(d))
      } else {
        return null
      }
      // this.changes()moment(sd, 'YYYY-MM-DD', true)

    },



    //
    // changesCount() {
    //   return _.length(this.changes())
    // },
    //
    // hasChanges() {
    //   return this.changesCount() > 0
    // },
    //
    // firstChange() {
    //   return _.first(changes())
    // },
    //
    // minDate() {
    //   return _.last(changes())
    // },
    //
    // maxDate() {
    //
    // },

    groups() {
      return this.props.groups
    },

    groupQuantity(d, group) {
      if(this.findChangeForDay(d)) {
        return this.findChangeForDay(d)[group.id].in_quantity
      } else {
        return null
      }
    },

    generalQuantity(d) {
      if(this.findChangeForDay(d)) {
        return this.findChangeForDay(d)[''].in_quantity
      } else {
        return null
      }
    },

    renderAnyQuantity(text, day, key, value) {



      if(day.isSame(this.firstDateToShow())) {

        var colSpan = moment.duration(this.firstChangeAsMoment().diff(this.firstDateToShow())).asDays()

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


        return (
          <td key={key} colSpan={colSpan} style={tdStyle}>
            <div style={divStyle}>
              {text}
            </div>
          </td>
        )
      } else if(day.isBefore(this.firstChangeAsMoment(), 'day')) {
        return null
      }



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

    renderTotal(d) {
      return this.renderAnyQuantity(
        'Total verfügbar',
        d,
        'day_' + this.fullFormat(d),
        this.totalQuantity(d)
      )
    },

    renderGroupQuantity(d, group) {
      return this.renderAnyQuantity(
        'Verfügbar in Gruppe \'' + group.name + '\'',
        d,
        'group_day_' + this.fullFormat(d),
        this.groupQuantity(d, group)
      )
    },

    renderGeneralQuantity(d) {
      return this.renderAnyQuantity(
        'Verfügbar für alle',
        d,
        'group_day_' + this.fullFormat(d),
        this.generalQuantity(d)
      )
    },

    renderTotals() {
      return _.compact(this.daysToShow().map((d) => {
        return this.renderTotal(d)
      }))
    },

    renderGroupQuantities(group) {
      return _.compact(this.daysToShow().map((d) => {
        return this.renderGroupQuantity(d, group)
      }))
    },

    renderGeneralQuantities() {
      return _.compact(this.daysToShow().map((d) => {
        return this.renderGeneralQuantity(d)
      }))
    },

    renderGroup(group) {
      return (
        <tr key={'group_' + group.id}>
          {this.renderGroupQuantities(group)}
        </tr>
      )
    },

    groupKey(groupId) {
      if(!groupId) {
        return ''
      } else {
        return groupId
      }
    },

    collectReservationFrames(groupId) {

      return _.filter(this.props.running_reservations, (rr) => rr.group_id == groupId).map(
        (rr) => {
          return {
            rr: rr,
            arr: _.find(this.props.availability.running_reservations, (rr2) => rr2.id == rr.id)
          }
        }
      ).map((prr) => {
        return {
          rid: prr.rr.id,
          start: this.parseFull(prr.arr.start_date),
          end: (prr.rr.late ? this.lastDateToShow() : this.parseFull(prr.arr.end_date))
        }
      })

      // return _.reduce(
      //   this.pairsMomentWithChange(),
      //   (memo, p) => {
      //     var day = _.first(p)
      //     var changes = _.last(p)[this.groupKey(groupId)]
      //     var rr = changes.running_reservations
      //     // debugger
      //
      //     _.each(rr, (rid) => {
      //       if(!memo[rid]) {
      //         memo[rid] = {start: moment(day), end: null, rid}
      //       }
      //     })
      //
      //     _.each(memo, (frame, rid) => {
      //       if(!_.contains(rr, rid)) {
      //         if(!memo[rid].end) {
      //           memo[rid].end = moment(day).add(- 1, 'days')
      //         }
      //       }
      //     })
      //
      //     return memo
      //   },
      //   {}
      // )
    },

    sortedReservationFrames(groupId) {
      return _.sortBy(
        this.collectReservationFrames(groupId),
        (f) => {
          var compare = ''
          if(!f.end) {
            compare += '0000-00-00'
          } else {
            compare += this.fullFormat(f.end)
          }
          compare += '/'
          if(!f.start) {
            compare += '9999-99-99'
          } else {
            compare += this.fullFormat(f.start)
          }
          return compare
        }
      )

    },


    isStartReservationDay(rf, d) {
      return d.isSame(rf.start, 'day')
    },

    isNoneReservationDay(rf, d) {
      return d.isBefore(rf.start, 'day') || d.isAfter(rf.end, 'day')
    },

    reservationColspan(rf, d) {
      return moment.duration(
        rf.end.diff(rf.start)
      ).asDays() + 1
    },

    reservationDetails(rf) {
      return _.find(
        this.props.running_reservations,
        (rr) => {
          return rr.id == rf.rid
        }
      )
    },

    reservationUsername(rf) {
      var u = this.reservationDetails(rf).user
      return u.firstname + ' ' + (u.lastname ? u.lastname : '')
    },


    renderReservationFrameContent(rf, d) {

      return this.reservationUsername(rf)
      // if(!d.isBefore(rf.start, 'day') && !d.isAfter(rf.end, 'day')) {
      //   return 'x'
      // } else {
      //   return null
      // }

    },



    renderReservationFrameDay(rf, d) {

      if(this.isNoneReservationDay(rf, d)) {
        return(
          <td key={'group_reservation_day_' + rf.rid + '_' + this.fullFormat(d)} style={{border: 'dotted black', borderWidth: '0px 1px 0px 0px'}}>
          </td>
        )
      } else if(this.isStartReservationDay(rf, d)) {
        return (
          <td key={'group_reservation_day_' + rf.rid + '_' + this.fullFormat(d)} colSpan={this.reservationColspan(rf, d)} style={{padding: '5px 0px 5px 0px'}}>
            <div style={{backgroundColor: '#adadad', fontSize: '12px', color: '#333', padding: '3px', borderRadius: '3px', /*overflow: 'hidden', width: ((40 * this.reservationColspan(rf, d)) + 'px'),*/ height: '20px', paddingLeft: '6px'}}>
              {this.renderReservationFrameContent(rf, d)}
            </div>
          </td>
        )
      } else {
        return (
          null
        )
      }
    },

    renderReservationFrameDays(rf) {
      return this.daysToShow().map((d) => {
        return this.renderReservationFrameDay(rf, d)
      })
    },


    renderReservationFrame(rf) {

      return (
        <tr key={'group_reservation_' + rf.rid}>
          {this.renderReservationFrameDays(rf)}
        </tr>

      )

    },

    renderGroupReservations(groupId) {
      return this.sortedReservationFrames(groupId).map((rf) => {
        return this.renderReservationFrame(rf)
      })
    },

    renderGroupAndReservations(group) {
      return [this.renderGroup(group)].concat(this.renderGroupReservations(group.id))
    },

    renderGeneralAndReservations() {
      return [this.renderGeneral()].concat(this.renderGroupReservations(null))
    },

    renderGeneral() {
      return (
        <tr key={'general'}>
          {this.renderGeneralQuantities()}
        </tr>
      )
    },

    entitlements() {
      return _.compact(Object.keys(this.props.availability.entitlements))
    },


    renderGroups() {
      return this.entitlements().map((e) => {
        return this.renderGroupAndReservations(this.groups()[e])
      })

    },














    // sortedReservationFrames(groupId) {
    //   return _.sortBy(
    //     this.collectReservationFrames(groupId),
    //     (f) => {
    //       var compare = ''
    //       if(!f.end) {
    //         compare += '0000-00-00'
    //       } else {
    //         compare += this.fullFormat(f.end)
    //       }
    //       compare += '/'
    //       if(!f.start) {
    //         compare += '9999-99-99'
    //       } else {
    //         compare += this.fullFormat(f.start)
    //       }
    //       return compare
    //     }
    //   )
    //
    // },


    processProps() {
      return window.TimelineReadProps.readProps(this.props)
    },

    componentDidMount() {

      function getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
      }

      var today = document.getElementById('timeline_today')
      if(today) {
        var topLeft = getCoords(today)
        var top = 0
        var left = topLeft.left - document.body.getBoundingClientRect().width * 0.5
        if(left < 0) {
          left = 0
        }
        document.body.scrollTop = top
        document.body.scrollLeft = left
      }
    },


    render () {

      var data = this.processProps()

      var fromDay = data.firstChangeMoment
      var toDay = data.lastChangeMoment

      var visibleDaysToShow = _.filter(
        data.daysToShow,
        (d) => {
          return !d.isBefore(fromDay, 'day') && !d.isAfter(toDay, 'day')
        }
      )

      return window.TimelineRender.renderTimeline(data, visibleDaysToShow)

      // return (
      //   <table>
      //     <tbody>
      //       <tr>
      //         {this.renderMonths()}
      //       </tr>
      //       <tr>
      //         {this.renderDays()}
      //       </tr>
      //       <tr>
      //         {this.renderTotals()}
      //       </tr>
      //       {this.renderGroups()}
      //       {this.renderGeneralAndReservations()}
      //     </tbody>
      //   </table>
      // )
    }
  })
})()
