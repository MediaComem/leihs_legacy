window.TimelineGroupCalc = {

  groupKey(groupId) {
    if(!groupId) {
      return ''
    } else {
      return groupId
    }
  },

  groupQuantity(data, groupId, d) {

    var changesForDay = window.TimelineFindChanges.findChangesForDay(data, d)
    if(changesForDay) {
      return changesForDay[this.groupKey(groupId)].in_quantity
    } else {
      return null
    }
  }
}
