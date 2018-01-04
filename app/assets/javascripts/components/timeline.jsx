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
        fromDay: moment(data.firstChangeMoment).add(- 15, 'days'),
        toDay: moment(data.lastChangeMoment).add(1, 'month')
      }
    },

    preventTouchMove(event) {
    },

    preventScroll(event) {
    },

    preventMouseWheel(event) {
      var deltaX = event.deltaX
      if(deltaX > 100) deltaX = 100
      if(deltaX < -100) deltaX = -100
      var deltaY = event.deltaY
      if(deltaY > 30) deltaY = 30
      if(deltaY < -30) deltaY = -30
      document.body.scrollLeft += deltaX
      document.body.scrollTop += deltaY
      event.preventDefault()
    },

    componentDidMount() {
      window.addEventListener('touchmove', this.preventTouchMove, false);
      window.addEventListener('scroll', this.preventScroll, false);
      window.addEventListener('mousewheel', this.preventMouseWheel, false);
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
