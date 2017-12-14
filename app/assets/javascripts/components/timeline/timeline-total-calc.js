window.TimelineTotalCalc = {

  sumQuantities(change) {
    return _.reduce(
      _.values(change),
      (memo, c) => {
        return memo + c.in_quantity
      },
      0
    )
  },


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
  },


  totalQuantity(data, d) {
    var changesForDay = this.findChangesForDay(data, d)
    if(changesForDay) {
      return this.sumQuantities(changesForDay)
    } else {
      return null
    }
  }
}
