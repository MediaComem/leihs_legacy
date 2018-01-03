window.TimelineRenderDescription = {

  descriptionBarStyle(color) {
    return {
      marginLeft: '2px',
      marginRight: '2px',
      backgroundColor: color,
      fontSize: '12px',
      color: '#333',
      padding: '3px',
      borderRadius: '3px',
      /*overflow: 'hidden', width: ((40 * this.reservationColspan(rf, d)) + 'px'),*/
      height: '20px',
      paddingLeft: '6px',
      display: 'inline-block'
    }
  },

  renderDescription() {
    var style = {
      position: 'fixed',
      left: '10px',
      height: '30px',
      right: '10px',
      bottom: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '5px',
      padding: '5px'
    }

    return (
      <div style={style}>
        <div style={this.descriptionBarStyle('#e3be1f')}>{_jed('without conflict')}</div>
        <div style={this.descriptionBarStyle('chocolate')}>{_jed('reserved / item assigned in future')}</div>
        <div style={this.descriptionBarStyle('rgb(102, 224, 224)')}>{_jed('no item assigned')}</div>
        <div style={this.descriptionBarStyle('#c8b0c1')}>{_jed('unavailable / can\'t be guaranteed')}</div>
        <div style={this.descriptionBarStyle('rgb(255, 100, 100)')}>{_('overdue') + ' / ' + _('is late')}</div>
      </div>


    )
  }


}
