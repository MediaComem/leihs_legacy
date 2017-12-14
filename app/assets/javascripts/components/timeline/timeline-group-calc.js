window.TimelineGroupCalc = {



  groupQuantity(data, groupId, d) {

    var changesForDay = window.TimelineFindChanges.findChangesForDay(data, d)
    if(changesForDay) {
      return changesForDay[groupId].in_quantity
    } else {
      return null
    }
  }
}
