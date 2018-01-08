(() => {
  const React = window.React

  window.TimelineReservationBar = window.createReactClass({
    propTypes: {
    },

    displayName: 'TimelineReservationBar',

    getInitialState() {
      return {
        showPopup: false,
        popupPosition: null
      }
    },

    componentDidMount() {
      document.addEventListener('mousedown', this._handleClickOutside);
    },

    componentWillUnmount() {
      document.removeEventListener('mousedown', this._handleClickOutside);
    },

    _onToggle(event) {
      event.preventDefault()

      if(this.state.showPopup) {
        this.setState({
          popupPosition: {
            x: event.pageX - event.target.parentElement.offsetLeft
          }
        })
      } else {
        this.setState({
          showPopup: true,
          popupPosition: {
            x: event.pageX - event.target.parentElement.offsetLeft
          }
        })
      }
    },

    _onClose() {
      this.setState({showPopup: false})
    },

    _handleClickOutside(event) {
      if (this.barReference && !this.barReference.contains(event.target)
        && this.popup && !this.popup.contains(event.target)) {
        this._onClose()
      }
    },

    renderPhone() {
      return _jed('Phone') + ': ' + (this.reservation().phone ? this.reservation().phone : '')
    },

    takeBackLink() {
      return '/manage/' + this.reservation().inventoryPoolId + '/users/' + this.reservation().userId + '/take_back'
    },

    handOverLink() {
      return '/manage/' + this.reservation().inventoryPoolId + '/users/' + this.reservation().userId + '/take_back'
    },

    acknowledgeLink() {
      return '/manage/' + this.reservation().inventoryPoolId + '/orders/' + this.reservation().orderId + '/edit'
    },

    status() {
      return this.reservation().status
    },

    renderLink() {

      if(!this.props.isLendingManager) {
        return null
      }

      if(this.status() == 'submitted') {
        return (
          <a target='_top' href={this.acknowledgeLink()}>{_jed('Acknowledge')}</a>
        )
      } else if(this.status() == 'approved') {
        return (
          <a target='_top' href={this.takeBackLink()}>{_jed('Hand Over')}</a>
        )
      } else if(this.status() == 'signed') {
        return (
          <a target='_top' href={this.handOverLink()}>{_jed('Take Back')}</a>
        )
      } else {
        return null
      }
    },

    renderLateInfo() {

      if(!this.reservation().late) {
        return null
      }

      return (
        <b>{_jed('Item is overdue and therefore unavailable!')}</b>
      )
    },

    startDateString() {
      return this.reservation().startMoment.format('DD.MM.YYYY')
    },

    endDateString() {
      return this.reservation().endMoment.format('DD.MM.YYYY')
    },

    renderReservationDates() {
      return _jed('Reservation') + ': ' + this.startDateString() + ' ' + _jed('until') + ' ' + this.endDateString()
    },

    renderPopup() {
      if(!this.state.showPopup) {
        return null
      }

      return (

        <div style={{position: 'relative', top: '0px', left: '0px'}}>
          <div ref={(ref) => this.popup = ref} style={{position: 'absolute', top: '-10px', left: this.state.popupPosition.x, width: '260px', border: '1px solid black', borderRadius: '5px', margin: '2px', backgroundColor: '#fff', padding: '10px'}}>
            <div style={{fontSize: '16px', position: 'static', widthj: '260px'}}>
              <div className='timeline-event-bubble-title'>{this.renderLabel()}</div>
              <div className='timeline-event-bubble-body'>
                {this.renderPhone()}
                <br />
                {this.renderReservationDates()}
                <br />
                {this.renderLateInfo()}
                <br />
                <div className='buttons' style={{margin: '1.5em99'}}>
                  {this.renderLink()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )


    },

    reservation() {
      return this.props.reservationFrame
    },

    renderLabel() {
      return this.reservation().username + (this.reservation().inventoryCode ? ' (' + this.reservation().inventoryCode  + ')' : '')
    },

    render () {

      return (
        <td colSpan={this.props.colSpan} style={this.props.style}>
          <div onClick={this._onToggle} ref={(ref) => this.barReference = ref} style={this.props.innerStyle}>
            {this.renderLabel()}
          </div>
          {this.renderPopup()}
        </td>
      )

    }
  })
})()
