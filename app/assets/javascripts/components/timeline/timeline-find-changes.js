window.TimelineFindChanges = {

  findInChangesList(data, d) {
    var r = _.last(
      _.filter(
        data.changesList,
        (p) => {
          return !d.isBefore(p.moment, 'day')
        }
      )
    )

    if(!r) {
      return r
    }

    if(d.isAfter(data.lastChangeMoment)) {
      return null
    } else {
      return r
    }
  },


  findChangesForDay(data, d) {
    var foundChanges = this.findInChangesList(data, d)
    if(foundChanges) {
      return foundChanges.changes
    } else {
      null
    }
  }


}
