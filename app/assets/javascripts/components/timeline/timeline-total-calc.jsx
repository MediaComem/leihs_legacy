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

  totalQuantity(data, d) {
    var changesForDay = window.TimelineFindChanges.findChangesForDay(data, d)
    if(changesForDay) {
      return this.sumQuantities(changesForDay)
    } else {
      return null
    }
  }
}
