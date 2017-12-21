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

    render () {

      var data = this.state.data

      var fromDay = moment(this.state.fromDay)
      var toDay = moment(this.state.toDay)

      var visibleDaysToShow = _.filter(
        data.daysToShow,
        (d) => {
          return !d.isBefore(fromDay, 'day') && !d.isAfter(toDay, 'day')
        }
      )

      return window.TimelineRender.renderTimeline(data, visibleDaysToShow)
    }
  })
})()
