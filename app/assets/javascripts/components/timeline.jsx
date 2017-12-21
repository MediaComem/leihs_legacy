(() => {
  const React = window.React

  window.Timeline = window.createReactClass({
    propTypes: {
    },

    displayName: 'Timeline',

    processProps() {
      return window.TimelineReadProps.readProps(this.props)
    },

    getInitialState() {
      var data = this.processProps()
      return {
        data: this.processProps(),
        fromDay: moment(data.firstChangeMoment).add(- 3, 'month'),
        toDay: moment(data.lastChangeMoment).add(3, 'month')
      }
    },


    numberOfDaysToShow(start, end) {
      return moment.duration(
        end.diff(start)
      ).asDays()
    },

    daysToShow(start, end) {
      return _.range(0, this.numberOfDaysToShow(start, end)).map((d) => {
        return moment(start).add(d, 'days')
      })
    },

    render () {

      var data = this.state.data

      var fromDay = moment(this.state.fromDay)
      var toDay = moment(this.state.toDay)

      var visibleDaysToShow = this.daysToShow(fromDay, toDay)

      return window.TimelineRender.renderTimeline(data, visibleDaysToShow)
    }
  })
})()
