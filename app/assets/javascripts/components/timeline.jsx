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

    firstChangeAsMoment() {
      return _.first(_.first(this.pairsMomentWithChange()))
    },

    lastChangeAsMoment() {
      return _.first(_.last(this.pairsMomentWithChange()))
    },

    firstDateToShow() {
      return this.firstChangeAsMoment().add(- 1, 'month')
    },

    lastDateToShow() {
      return this.lastChangeAsMoment().add(1, 'month')
    },

    numberOfDaysToShow() {
      return moment.duration(
        this.lastDateToShow().diff(this.firstDateToShow())
      ).asDays()
    },

    daysToShow() {
      return _.range(0, this.numberOfDaysToShow()).map((d) => {
        return this.firstDateToShow().add(d, 'days')
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

      return this.firstDaysPerMonthToShow().map((fd) => {
        return (
          <td key={'month_' + fd.format('YYYY-MM')} colSpan={this.daysToShowPerMonth(fd)}>{fd.format('MMM') + ' ' + fd.format('YYYY')}</td>
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
        <td key={'day_' + this.fullFormat(d)}>{d.format('DD')}</td>
      )
    },

    renderDays() {
      return this.daysToShow().map((d) => {
        return this.renderDay(d)
      })
    },

    findPairMomentWithChangeForDay(d) {
      return _.last(
        _.filter(
          this.pairsMomentWithChange(),
          (p) => {
            return !d.isBefore(_.first(p), 'day')
          }
        )
      )
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
      if(this.findChangeForDay(d)) {
        return this.sumQuantities(this.findChangeForDay(d))
      } else {
        return null
      }
      // this.changes()moment(sd, 'YYYY-MM-DD', true)

    },

    renderTotal(d) {
      return (
        <td key={'day_' + this.fullFormat(d)}>{this.totalQuantity(d)}</td>
      )
    },

    renderTotals() {
      return this.daysToShow().map((d) => {
        return this.renderTotal(d)
      })
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

    entitlements() {
      return _.compact(Object.keys(this.props.availability.entitlements))
    },

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

    renderGroupQuantity(d, group) {
      return (
        <td key={'group_day_' + this.fullFormat(d)}>{this.groupQuantity(d, group)}</td>
      )
    },

    renderGroupQuantities(group) {
      return this.daysToShow().map((d) => {
        return this.renderGroupQuantity(d, group)
      })

    },

    renderGroup(group) {

      return (
        <tr key={'group_' + group.id}>
          {this.renderGroupQuantities(group)}
        </tr>
      )

    },

    renderGroups() {

      return this.entitlements().map((e) => {
        return this.renderGroup(this.groups()[e])
      })

    },

    render () {
      return (
        <table>
          <tbody>
            <tr>
              {this.renderMonths()}
            </tr>
            <tr>
              {this.renderDays()}
            </tr>
            <tr>
              {this.renderTotals()}
            </tr>
            {this.renderGroups()}
          </tbody>
        </table>
      )
    }
  })
})()
