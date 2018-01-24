(() => {
  const React = window.React

  window.TimelineNew = window.createReactClass({
    propTypes: {
    },

    displayName: 'TimelineNew',

    isBefore(m1, m2) {
      return m1.isBefore(m2, 'day')
    },

    isAfter(m1, m2) {
      return m1.isAfter(m2, 'day')
    },

    findMaximumMoment(moments) {
      return _.reduce(
        moments,
        (memo, m) => {
          if(memo == null) {
            return m
          } else {
            if(this.isAfter(m, memo)) {
              return m
            } else {
              return memo
            }
          }
        },
        null
      )
    },

    findMinimumMoment(moments) {
      return _.reduce(
        moments,
        (memo, m) => {
          if(memo == null) {
            return m
          } else {
            if(this.isBefore(m, memo)) {
              return m
            } else {
              return memo
            }
          }
        },
        null
      )
    },

    mapToMoments(isoDates) {
      return isoDates.map(
        (iso) => moment(iso)
      )
    },

    reservationStartDates() {
      return this.props.timeline_availability.running_reservations.map(
        (rr) => rr.start_date
      )
    },

    reservationEndDates() {
      return this.props.timeline_availability.running_reservations.map(
        (rr) => rr.end_date
      )
    },

    firstReservationMoment() {

      return moment().add(- 14, 'days').startOf('month')

      // var m = this.findMinimumMoment(
      //   this.mapToMoments(
      //     this.reservationStartDates()
      //   )
      // )
      //
      // if(m.isSameOrAfter(moment(), 'day')) {
      //   return moment().add(- 1, 'month')
      // } else {
      //   return m
      // }
    },

    lastReservationMoment() {
      var m = this.findMaximumMoment(
        this.mapToMoments(
          this.reservationEndDates()
        )
      )

      if(m.isSameOrBefore(moment(), 'day')) {
        return moment().add(+ 1, 'month').endOf('month')
      } else {
        return m.endOf('month')
      }

    },

    numberOfDays(firstMoment, lastMoment) {
      return this.daysDifference(lastMoment, firstMoment) + 1
    },


    offset(firstMoment) {
      return this.daysDifference(moment(), firstMoment)
    },


    renderLabel(firstMoment, text) {

      var offset = this.offset(firstMoment)


      return (
        <div style={{margin: '2px', padding: '4px', fontSize: '16px', position: 'absolute', top: '0px', left: (offset * 30 - 1000 - 20) + 'px', textAlign: 'right', width: '1000px', height: '30px', border: '0px'}}>
          {text}
        </div>
      )
    },

    renderLabelSmall(firstMoment, text) {

      var offset = this.offset(firstMoment)


      return (
        <div style={{fontSize: '10px', padding: '4px', margin: '2px', position: 'absolute', top: '0px', left: (offset * 30 - 1000 - 20) + 'px', textAlign: 'right', width: '1000px', height: '30px', border: '0px'}}>
          {text}
        </div>
      )
    },


    renderValue(prefix, index, offset, value, backgroundColor) {
      return (
        <div key={prefix + index} style={{position: 'absolute', top: '0px', left: ((offset + index) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          <div style={{backgroundColor: backgroundColor, textAlign: 'center', fontSize: '16px', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', padding: '4px', margin: '2px', borderRadius: '5px'}}>
            {value}
          </div>
        </div>
      )

    },

    renderValueSmall(prefix, index, offset, value, backgroundColor) {
      return (
        <div key={prefix + index} style={{position: 'absolute', top: '0px', left: ((offset + index) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          <div style={{textAlign: 'center', fontSize: '10px', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', padding: '4px', margin: '2px'}}>
            {value}
          </div>
        </div>
      )

    },


    renderIndexedQuantities(valueFunc, firstMoment, lastMoment, colorFunc) {

      var offset = this.offset(firstMoment)

      var range = _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      )

      return _.map(
        range,
        (i) => {

          var value = valueFunc(i)

          var color = colorFunc(i)

          return this.renderValue('handout_count_', i, offset, value, color)
          // return (
          //   <div key={'handout_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: ((offset + i) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          //     {value}
          //   </div>
          // )
        }
      )
    },

    renderIndexedQuantitiesSmall(valueFunc, firstMoment, lastMoment, colorFunc) {

      var offset = this.offset(firstMoment)

      var range = _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      )

      return _.map(
        range,
        (i) => {

          var value = valueFunc(i)

          var color = colorFunc(i)

          return this.renderValueSmall('handout_count_', i, offset, value, color)
          // return (
          //   <div key={'handout_count_' + i} style={{fontSize: '16px', position: 'absolute', top: '0px', left: ((offset + i) * 30) + 'px', width: '30px', height: '30px', border: '0px'}}>
          //     {value}
          //   </div>
          // )
        }
      )
    },


    renderMonth(firstMoment, monthFrom, monthTo, isLast) {

      var offset = (m) => {
        return this.daysDifference(m, firstMoment)
      }

      var offset = offset(monthFrom)
      var length = this.numberOfDays(monthFrom, monthTo)

      var border = '1px solid black'
      if(isLast) {
        border = 'none'
      }

      return (
        <div key={'month_' + monthFrom.format('YYYY-MM')} style={{position: 'absolute', top: '0px', left: (offset * 30) + 'px', width: (length * 30) + 'px', bottom: '0px', border: '0px'}}>
          <div style={{fontSize: '14px', paddingTop: '10px', textAlign: 'center', position :'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px', border: border, borderWidth: '0px 1px 0px 0px'}}>
            {monthFrom.format('MMMM')}
          </div>
        </div>
      )
    },

    renderMonths(firstMoment, lastMoment) {

      var months = []
      var monthFrom = moment(firstMoment)
      while(monthFrom.isSameOrBefore(lastMoment, 'day')) {

        var monthTo = moment(monthFrom).endOf('month')
        if(monthTo.isAfter(lastMoment)) {
          monthTo = moment(lastMoment)
        }

        months.push({
          from: monthFrom,
          to: monthTo
        })


        monthFrom = moment(monthTo).add(1, 'month').startOf('month')
      }

      return months.map((month, index) => {
        return this.renderMonth(firstMoment, month.from, month.to, index == months.length - 1)
      })

    },

    renderDays(firstMoment, numberOfDaysToShow) {

      return _.map(
        _.range(0, numberOfDaysToShow),
        (i) => {

          var m = moment(firstMoment).add(i, 'days')

          var backgroundColor = 'none'
          if(m.isSame(moment(), 'day')) {
            backgroundColor = '#dadada'
          }

          return (
            <div key={'day_' + i} style={{position: 'absolute', top: '0px', left: (i * 30) + 'px', width: '30px', bottom: '0px', border: '0px'}}>
              <div style={{textAlign: 'center', paddingTop: '5px', backgroundColor: backgroundColor, position :'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px', border: '1px dotted black', borderWidth: '1px 1px 0px 0px'}}>
                {m.format('DD')}
              </div>
            </div>
          )
        }
      )


    },

    daysDifference(m1, m2) {
      return m1.startOf('day').diff(m2.startOf('day'), 'days')
    },

    findUser(timeline_availability, user_id) {
      return _.find(
        timeline_availability.reservation_users,
        (ru) => {
          return ru.id == user_id
        }
      )
    },

    reservationLabel(timeline_availability, rr, color) {

      var label = this.username(timeline_availability, rr)

      var elements = [
        <span key='label'>{label}</span>
      ]

      var inventoryCode = this.inventoryCode(timeline_availability, rr)
      if(inventoryCode) {
        elements.push(
          <span key='inventory_code' style={{color: color, backgroundColor: '#383838', marginLeft: '10px', padding: '0px 3px 0px 3px'}}>{inventoryCode}</span>
        )
      }

      return elements
    },

    username(timeline_availability, rr) {
      var u = this.findUser(timeline_availability, rr.user_id)
      var name = u.firstname
      if(u.lastname) {
        name += ' ' + u.lastname
      }
      return name
    },

    inventoryCode(timeline_availability, rr) {

      if(!rr.item_id) {
        return null
      }

      return _.find(
        timeline_availability.items,
        (i) => i.id == rr.item_id
      ).inventory_code


    },

    late(r) {
      return r.status == 'signed' &&


        !r.returned_date && this.isBefore(moment(r.end_date), moment())
    },


    reserved(r) {
      return this.isAfter(moment(r.start_date), moment()) && r.item_id
    },


    sortedReservations(reservations) {

      return _.sortBy(
        reservations,
        (r) => {
          var compare = ''
          if(!r.end_date || this.late(r)) {
            compare += '9999-99-99'
          } else {
            compare += r.end_date
          }
          compare += '/'
          if(!r.start_date) {
            compare += '0000-00-00'
          } else {
            compare += r.start_date
          }
          return compare
        }
      )
    },


    hasIntersection(rfs, rf) {

      return _.find(rfs, (rfi) => {

        var startA = moment(rf.start_date)
        var endA = moment(rf.end_date)
        var lateA = this.late(rf)//rf.late
        var reservedA = this.reserved(rf)//rf.reserved
        var startB = moment(rfi.start_date)
        var endB = moment(rfi.end_date)
        var lateB = this.late(rfi)//rfi.late
        var reservedB = this.reserved(rfi)//rfi.reserved

        if(!lateB && !reservedA && this.isAfter(startA, endB) || !lateA && !reservedB && this.isAfter(startB, endA)) {
          return false
        } else {
          return true
        }

      })

    },

    findNoneIntersectionLine(lines, rf) {
      return _.find(lines, (line) => {
        return !this.hasIntersection(line, rf)
      })
    },

    layoutReservationFrames(reservations) {

      var rfs = this.sortedReservations(reservations)


      return _.reduce(
        rfs,
        (memo, rf) => {

          if(memo.length == 0) {
            return memo.concat([[rf]])
          } else {

            var line = this.findNoneIntersectionLine(memo, rf)

            if(!line) {
              return memo.concat([[rf]])
            } else {
              line.push(rf)
              return memo
            }

          }
        },
        []
      ).map((line) => {
        return _.sortBy(line, (rfi) => {
          return rfi.start_date
        })
      })

    },

    calcReservationsHeight(layouted) {

      return layouted.length * 20

    },


    renderReservations(layouted, firstMoment, lastMoment, timeline_availability, invalidReservations) {



      return layouted.map((line, index) => {

        return line.map((rr) => {

          var start = moment(rr.start_date)
          var end = moment(rr.end_date)

          var offset = this.daysDifference(start, firstMoment)

          var height = 15
          var padding = 5
          var totalHeight = height + padding




          if(this.late(rr)) {
            var length = this.numberOfDays(start, end)
            var lateLength = this.numberOfDays(start, lastMoment) - length


            // background-color: gray;
            // background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,255,.5) 50%);
            // background-size: 50px 50px;

            // http://lea.verou.me/css3patterns/#diagonal-stripes
            return [
              <div key={'reservation_late_' + rr.id} style={{position: 'absolute', top: (index * totalHeight) + 'px', left: (offset * 30 + length * 30) + 'px', width: (lateLength * 30) + 'px', height: height + 'px', border: '0px'}}>
                <div style={{backgroundColor: 'rgba(212, 84, 84, 0.5)', position: 'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px', borderRadius: '0px 5px 5px 0px', padding: '2px 5px', margin: '3px 3px 3px 0px'}}>
                  {' '}
                </div>
              </div>
              ,
              <div key={'reservation_' + rr.id} style={{position: 'absolute', top: (index * totalHeight) + 'px', left: (offset * 30) + 'px', width: (length * 30) + 'px', height: height + 'px', border: '0px'}}>
                <div style={{backgroundColor: 'rgba(212, 84, 84, 1.0)', color: '#eee', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: (length * 30 - 4) + 'px', position: 'absolute', top: '0px', left: '0px', bottom: '0px', borderRadius: '5px 0px 0px 5px', padding: '2px 5px', margin: '0px 0px 0px 3px'}}>
                  {this.reservationLabel(timeline_availability, rr, '#eee') /*+ ' ' + rr.id*/}
                </div>
              </div>
            ]

          } else {

            var length = this.numberOfDays(start, end)

            var backgroundColor = '#e3be1f'
            var margin = '0px 3px'
            var border = 'none'
            var padding = '2px 5px'
            if(invalidReservations[rr.id]) {
              // backgroundColor = '#e37b1f'
              margin = '0px 3px'
              border = '2px solid red'
              padding = '0px 5px'
            }

            return (
              <div key={'reservation_' + rr.id} style={{position: 'absolute', top: (index * totalHeight) + 'px', left: (offset * 30) + 'px', width: (length * 30) + 'px', height: height + 'px', border: '0px'}}>
                <div style={{backgroundColor: backgroundColor, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: (length * 30 - 4 - 3) + 'px', borderRadius: '5px', padding: padding, margin: margin, border: border}}>
                  {this.reservationLabel(timeline_availability, rr, '#e3be1f') /*+ ' ' + rr.id*/}
                </div>
              </div>
            )
          }




        })

      })
    },

    relevantItems() {
      return _.filter(
        this.props.timeline_availability.items,
        (i) => {
          return i.is_borrowable && !i.is_broken && !i.retired
        }
      )
    },

    relevantItemsCount() {
      return this.relevantItems().length
    },

    reservationIntersectsDay(rf, day) {



      var start = moment(rf.start_date)
      var end = moment(rf.end_date)
      var late = this.late(rf)
      var reserved = this.reserved(rf)


      if(!reserved && this.isAfter(start, day) || !late && this.isAfter(day, end)) {
        return false
      } else {
        return true
      }


    },

    reservationsForDay(timeline_availability, day) {

      return _.filter(
        timeline_availability.running_reservations,
        (r) => this.reservationIntersectsDay(r, day)
      )



    },

    entitlementQuantities(timeline_availability, relevantItemsCount) {

      return _.object(timeline_availability.entitlements.map((e) => {
        return [
          e.entitlement_group_id,
          e.quantity
        ]
      }).concat([
        [
          '',
          relevantItemsCount - _.reduce(
            timeline_availability.entitlements,
            (memo, e) => memo + e.quantity,
            0
          )
        ]
      ]))

    },


    reservationsInGroups(timeline_availability, entitlementQuantities, lastMoment, relevantItemsCount) {


      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {

        var day = moment().add(i, 'days')

        var dayReservations = this.reservationsForDay(timeline_availability, day)

        return _.mapObject(entitlementQuantities, (q, g) => {

          return _.filter(
            dayReservations,
            (r) => {
              return this.isReservationInGroup(r, g, timeline_availability)
            }
          )

        })




      })
    },


    reservationCounts(timeline_availability, lastMoment) {

      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {

        var day = moment().add(i, 'days')
        return _.filter(
          this.reservationsForDay(timeline_availability, day),
          (r) => {
            return r.status != 'signed'
          }
        )

      })
    },


    totalCounts(lastMoment, relevantItemsCount) {
      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {
        return relevantItemsCount
      })
    },


    handoutCounts(timeline_availability, lastMoment) {

      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {

        var day = moment().add(i, 'days')
        return _.filter(
          this.reservationsForDay(timeline_availability, day),
          (r) => {
            return r.status == 'signed'
          }
        )

      })
    },

    signedReservations() {
      return _.filter(
        this.props.timeline_availability.running_reservations,
        (rr) => rr.status == 'signed'
      )
    },

    notSignedReservations() {
      return _.filter(
        this.props.timeline_availability.running_reservations,
        (rr) => rr.status != 'signed'
      )
    },

    usableColors(index) {
      return 'rgb(210, 210, 210)'
    },

    handoutColors(index) {
      return 'rgb(210, 210, 210)'
    },

    reservationColors(index) {
      return 'rgb(210, 210, 210)'
      // return 'rgb(170, 221, 170)'
    },

    borrowableColors(index) {
      return 'rgb(210, 210, 210)'
      // return 'rgb(170, 221, 170)'
    },



    reservationEntitlements(timeline_availability, reservation, userEntitlementGroupsForModel) {


      var userId = reservation.user_id

      var entitlements = userEntitlementGroupsForModel[userId]

      return entitlements.map((e) => e.id)



    },


    hasPendingBooking(booking) {
      return this.pendingBooking(booking) != null
    },

    pendingBooking(booking) {
      return _.find(booking, (b) => b.assignment == null)
    },

    assignedBookings(booking) {
      return _.filter(booking, (b) => b.assignment != null)
    },

    trySimpleAssign(current, leftovers) {

      _.each(
        current.entitlementGroupIds,
        (egid) => {
          if(current.assignment == null && leftovers[egid] != undefined && leftovers[egid] > 0) {
            current.assignment = egid
            leftovers[egid]--
          }
        }
      )
    },

    tryModify(current, assignedBooking, leftovers) {

      var currentAssignment = assignedBooking.assignment
      var candidates = _.difference(
        assignedBooking.entitlementGroupIds,
        [currentAssignment]
      )
      candidates = _.difference(
        candidates,
        current.entitlementGroupIds
      )

      var candidate = _.find(
        candidates,
        (egid) => {
          return leftovers[egid] != undefined && leftovers[egid] > 0
        }
      )

      if(candidate) {
        current.assignment = assignedBooking.assignment
        leftovers[assignedBooking.assignment]--

        leftovers[assignedBooking.assignment]++
        leftovers[candidate]--
        assignedBooking.assignment = candidate
      }
    },

    findCandidateGroupId(current, assignedBooking, leftovers) {

    },

    modifyAnAssignedBooking(current, assignedBookings, leftovers) {

      _.each(
        assignedBookings,
        (ab) => {
          if(current.assignment == null) {
            this.tryModify(current, ab, leftovers)
          }
        }

      )

    },

    assignBooking(current, assignedBookings, leftovers) {

      this.trySimpleAssign(current, leftovers)
      if(current.assignment == null) {
        this.modifyAnAssignedBooking(current, assignedBookings, leftovers)
      }
      if(current.assignment == null) {
        current.assignment = ''
      }

    },

    newAlgorithm(reservations, constraints) {

      var leftovers = _.clone(constraints)
      var booking = _.map(reservations, (entitlementGroupIds, reservationId) => {
        return {
          reservationId: reservationId,
          assignment: null,
          entitlementGroupIds: _.sortBy(entitlementGroupIds, (v) => v) // general group '' first
        }
      })

      while(this.hasPendingBooking(booking)) {
        var current = this.pendingBooking(booking)
        var assignedBookings = this.assignedBookings(booking)
        this.assignBooking(
          current,
          assignedBookings,
          leftovers
        )

      }

      return booking

    },


    newAlgorithmForReservations(timeline_availability, reservationsList, userEntitlementGroupsForModel, relevantItemsCount) {

      var reservations = _.object(reservationsList.map((r) => {
        return [
          r.id,
          this.reservationEntitlements(timeline_availability, r, userEntitlementGroupsForModel).concat([''])
        ]
      }))

      var constraints = _.object(
        timeline_availability.entitlements.map((e) => {
          return [
            e.entitlement_group_id,
            e.quantity
          ]
        }).concat([
          [
            '',
            relevantItemsCount - _.reduce(
              timeline_availability.entitlements,
              (memo, e) => memo + e.quantity,
              0
            )
          ]
        ])
      )

      return this.newAlgorithm(reservations, constraints)


    },

    userEntitlementGroupsForModel(timeline_availability) {

      var userEntitlementGroups = this.calculateUserEntitlementGroups(timeline_availability)

      var entitlementGroupIds = timeline_availability.entitlements.map((e) => e.entitlement_group_id)

      // debugger
      return _.object(
        _.map(
          userEntitlementGroups,
          (uegs, uid) => {

            return [
              uid,
              _.filter(
                uegs,
                (ueg) => {
                  return _.contains(entitlementGroupIds, ueg.id)
                }
              )
            ]
          }
        )
      )
    },



    entitlementQuantityPerGroup(timeline_availability) {

      return _.object(
        timeline_availability.entitlements.map((e) => {
          return [
            e.entitlement_group_id,
            e.quantity
          ]
        })
      )

    },

    quantityGeneral(timeline_availability) {

      var sumEntitlements = _.reduce(
        this.entitlementQuantityPerGroup(timeline_availability),
        (memo, q) => memo + q
      )

      return this.relevantItemsCount() - sumEntitlements
    },

    maxQuantityPerUser(timeline_availability) {

      var userEntitlementGroups = this.calculateUserEntitlementGroups(timeline_availability)
      var quantityPerGroup = this.entitlementQuantityPerGroup(timeline_availability)

      return _.object(
        timeline_availability.reservation_users.map((u) => {

          var entitlementGroups = userEntitlementGroups[u.id]

          var sum = _.reduce(
            entitlementGroups,
            (memo, eg) => {
              if(quantityPerGroup[eg.id]) {
                return memo + quantityPerGroup[eg.id]
              } else {
                return memo
              }
            },
            0
          )

          return [
            u.id,
            sum
          ]
        })
      )




    },

    groupsForUser(user_id, timeline_availability) {

      return _.filter(timeline_availability.entitlement_groups_users, (egu) => {
        return egu.user_id == user_id
      }).map((egu) => egu.entitlement_group_id)

    },

    groupsForUsers(timeline_availability) {

      return _.object(timeline_availability.reservation_users.map((u) => {
        return [
          u.id,
          this.groupsForUser(u.id, timeline_availability)
        ]
      }))
    },

    isReservationInGroup(reservation, groupId, timeline_availability) {
      return _.contains(this.groupsForUsers(timeline_availability)[reservation.user_id], groupId)
    },

    calculateUserEntitlementGroups(timeline_availability) {

      return _.object(
        timeline_availability.reservation_users.map((u) => {
          return [
            u.id,

            _.filter(timeline_availability.entitlement_groups_users, (egu) => {
              return egu.user_id == u.id
            }).map(
              (egu) => {
                return _.find(timeline_availability.entitlement_groups, (eg) => {
                  return eg.id == egu.entitlement_group_id
                })
              }
            )
          ]
        })
      )

    },

    getInitialState() {
      return {
        // position: 0,
        preprocessedData: this.preprocessData(this.props.timeline_availability)
      }
    },



    entitlementGroupNameForId(timeline_availability, groupId) {
      var entitlementGroup = _.find(
        timeline_availability.entitlement_groups,
        (eg) => {
          return eg.id == groupId
        }
      )

      var name = ''
      if(entitlementGroup) {
        name = entitlementGroup.name
      }

      return name

    },

    renderEntitlementQuantity(timeline_availability, changesForDays, reservationsInGroups, quantity, groupId, topEntitlement, wholeWidth, firstMoment, lastMoment, relevantItemsCount) {

      if(groupId == '') {
        label = 'Frei für alle'
      } else {
        var name = this.entitlementGroupNameForId(timeline_availability, groupId)
        label = 'Reserviert für Gruppe ' + name + ':'
      }


      var mappingReservation = (index) => {

        return quantity
      }

      var mappingAssigned = (index) => {

        var algo = changesForDays[index].algorithm
        var count = _.size(_.filter(algo, (a) => a.assignment == groupId))

        if(count > quantity) {


          return quantity
        } else {
          return count
        }

      }

      var mappingUnassigned = (index) => {

        var algo = changesForDays[index].algorithm
        var count = _.size(_.filter(algo, (a) => a.assignment == groupId))



        if(count > quantity) {
          var value = count - quantity
          var total = changesForDays[index].available
          if(total < 0) {
            value += total
          }
          return (
            <span style={{color: 'red'}}>{value}</span>
          )
        } else {
          return 0
        }

      }

      var reservedDiv = (
        <div key={'reserved_' + groupId} style={{position: 'absolute', top: topEntitlement + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
          {this.renderLabelSmall(firstMoment, label)}
          {this.renderIndexedQuantitiesSmall(mappingReservation, firstMoment, lastMoment, this.reservationColors)}
        </div>
      )

      var assignedDiv = (
        <div key={'assigned_' + groupId} style={{position: 'absolute', top: (topEntitlement + 20) + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
          {this.renderLabelSmall(firstMoment, 'davon verwendet:')}
          {this.renderIndexedQuantitiesSmall(mappingAssigned, firstMoment, lastMoment, this.reservationColors)}
        </div>
      )

      var unassignedDiv = null
      if(groupId == '') {
        unassignedDiv = (
          <div key={'unassigned_' + groupId} style={{position: 'absolute', top: (topEntitlement + 60) + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderLabelSmall(firstMoment, 'Ansprüche nicht erfüllbar:')}
            {this.renderIndexedQuantitiesSmall(mappingUnassigned, firstMoment, lastMoment, this.reservationColors)}
          </div>
        )
      }

      return _.compact([reservedDiv, assignedDiv, unassignedDiv])

    },

    renderEntitlementQuantities(timeline_availability, changesForDays, reservationsInGroups, entitlementQuantities, topFreeItems, wholeWidth, firstMoment, lastMoment, relevantItemsCount) {

      var topEntitlements = topFreeItems + 40

      return _.map(entitlementQuantities, (quantity, groupId) => {
        return {
          groupId: groupId,
          quantity: quantity
        }
      }).map((v, index) => {
        return this.renderEntitlementQuantity(timeline_availability, changesForDays, reservationsInGroups, v.quantity, v.groupId, topEntitlements + index * 30 * 2, wholeWidth, firstMoment, lastMoment, relevantItemsCount)
      })
    },



    changesDates(timeline_availability) {

      return _.sortBy(
        _.map(
          _.reduce(
            timeline_availability.running_reservations,
            (memo, r) => {

              var ds = []
              memo[r.start_date] = r.start_date
              var before_start_date = moment(r.start_date).add(- 1, 'days').format('YYYY-MM-DD')
              memo[before_start_date] = before_start_date
              if(!this.late(r)) {
                memo[r.end_date] = r.end_date
                var after_end_date = moment(r.end_date).add(+ 1, 'days').format('YYYY-MM-DD')
                memo[after_end_date] = after_end_date

              }

              return memo
            },
            {}
          ),
          (v) => v
        ),
        (v) => v
      )


    },

    calculateChangesReservations(timeline_availability, change) {
      var m = moment(change)
      return _.filter(
        timeline_availability.running_reservations,
        (r) => {
          var start = moment(r.start_date)
          var end = moment(r.end_date)
          return start.isSameOrBefore(m) && (end.isSameOrAfter(m) || this.late(r))
        }
      )


    },


    changesAlgorithm(timeline_availability, changes, userEntitlementGroupsForModel, relevantItemsCount) {
      return changes.map((c) => {
        var reservations = this.calculateChangesReservations(timeline_availability, c)
        if(c == '2018-02-06') debugger;
        return {
          change: c,
          date: c,
          reservations: reservations,
          algorithm: this.newAlgorithmForReservations(timeline_availability, reservations, userEntitlementGroupsForModel, relevantItemsCount),
          available: relevantItemsCount - _.size(reservations)
        }
      })
    },

    invalidReservations(timeline_availability, changesAlgorithm, relevantItemsCount) {

      var invalids = _.filter(
        changesAlgorithm,
        (c) => relevantItemsCount - _.size(c.reservations) < 0
      ).map((c) => c.change)

      var rids = _.uniq(_.flatten(invalids.map((c) => {
        return _.filter(
          this.calculateChangesReservations(timeline_availability, c),
          (r) => !r.item_id
        ).map(
          (r) => r.id
        )
      })))

      return _.object(rids.map((rid) => [rid, rid]))
    },

    changesForDays(timeline_availability, lastMoment, changesAlgorithm, relevantItemsCount) {

      return _.range(
        0,
        this.numberOfDays(moment(), lastMoment)
      ).map((i) => {

        var day = moment().add(i, 'days')

        return _.last(_.filter(
          changesAlgorithm,
          (c) => {
            var cm = moment(c.date)

            return day.isSameOrAfter(cm, 'day')
          }
        ))

      })

    },

    preprocessData(timeline_availability) {

      var firstMoment = this.firstReservationMoment()
      var lastMoment = this.lastReservationMoment()
      var numberOfDays = this.numberOfDays(firstMoment, lastMoment)
      var relevantItemsCount = this.relevantItemsCount()
      var totalCounts = this.totalCounts(lastMoment, relevantItemsCount)
      var handoutCounts = this.handoutCounts(this.props.timeline_availability, lastMoment).map((hc) => - hc.length)
      var borrowableCounts = _.zip(totalCounts, handoutCounts).map((p) => _.first(p) + _.last(p))
      var reservationCounts = this.reservationCounts(this.props.timeline_availability, lastMoment).map((rc) => - rc.length)
      var unusedCounts = _.zip(borrowableCounts, reservationCounts).map((p) => _.first(p) + _.last(p))
      var allLayoutedReservationFrames = this.layoutReservationFrames(this.props.timeline_availability.running_reservations)
      var userEntitlementGroupsForModel = this.userEntitlementGroupsForModel(this.props.timeline_availability)
      var entitlementQuantities = this.entitlementQuantities(this.props.timeline_availability, relevantItemsCount)
      var reservationsInGroups = this.reservationsInGroups(this.props.timeline_availability, entitlementQuantities, lastMoment, relevantItemsCount)
      var groupsForUsers = this.groupsForUsers(this.props.timeline_availability)
      var calculateChanges = this.changesDates(this.props.timeline_availability)
      var changesAlgorithm = this.changesAlgorithm(this.props.timeline_availability, calculateChanges, userEntitlementGroupsForModel, relevantItemsCount)
      var changesForDays = this.changesForDays(this.props.timeline_availability, lastMoment, changesAlgorithm, relevantItemsCount)
      var invalidReservations = this.invalidReservations(this.props.timeline_availability, changesAlgorithm, relevantItemsCount)

      return {
        firstMoment: firstMoment,
        lastMoment: lastMoment,
        numberOfDays: numberOfDays,
        relevantItemsCount: relevantItemsCount,
        totalCounts: totalCounts,
        handoutCounts: handoutCounts,
        borrowableCounts: borrowableCounts,
        reservationCounts: reservationCounts,
        unusedCounts: unusedCounts,
        allLayoutedReservationFrames: allLayoutedReservationFrames,
        userEntitlementGroupsForModel: userEntitlementGroupsForModel,
        entitlementQuantities: entitlementQuantities,
        reservationsInGroups: reservationsInGroups,
        groupsForUsers: groupsForUsers,
        calculateChanges: calculateChanges,
        // findEntitlementCombination: findEntitlementCombination,
        changesAlgorithm: changesAlgorithm,
        changesForDays: changesForDays,
        invalidReservations: invalidReservations
      }


    },

    render () {

      var preprocessedData = this.state.preprocessedData

      var firstMoment = preprocessedData.firstMoment
      var lastMoment = preprocessedData.lastMoment

      var numberOfDaysToShow = preprocessedData.numberOfDays

      var dayWidth = 30

      var relevantItemsCount = preprocessedData.relevantItemsCount

      var totalCounts = preprocessedData.totalCounts


      var handoutCounts = preprocessedData.handoutCounts

      var borrowableCounts = preprocessedData.borrowableCounts

      var reservationCounts = preprocessedData.reservationCounts

      var unusedCounts = preprocessedData.unusedCounts

      var allLayoutedReservationFrames = preprocessedData.allLayoutedReservationFrames

      var userEntitlementGroupsForModel = preprocessedData.userEntitlementGroupsForModel

      var entitlementQuantities = preprocessedData.entitlementQuantities

      var reservationsInGroups = preprocessedData.reservationsInGroups

      var wholeWidth = dayWidth * numberOfDaysToShow

      var unusedColors = (index) => {
        var delta = unusedCounts[index]
        if(delta > 0) {
          return 'rgb(170, 221, 170)'
        } else if(delta == 0) {
          return '#e4db5f'
          // return 'rgb(232, 147, 37)'
        } else {
          return 'rgb(221, 170, 170)'
        }
      }

      var topHandoutLines = 130 - 40 //+ this.state.position

      // var topTitle = 40

      var topTotal = 100 - 40

      var topAfterHandoutLines = topHandoutLines + this.calcReservationsHeight(allLayoutedReservationFrames)

      var topReservationLines = topAfterHandoutLines + 100

      var topAfterReservationLines = topAfterHandoutLines//topReservationLines + this.calcReservationsHeight(this.notSignedReservations())

      var topFreeItems = topAfterReservationLines + 80

      var wholeHeight = topFreeItems + 200


      return (
        <div style={{position: 'absolute', top: '0px', left: '0px', height: wholeHeight + 'px', width: wholeWidth + 'px', bottom: '0px'}}>
          <div style={{position: 'absolute', top: '0px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderMonths(firstMoment, lastMoment)}
          </div>
          <div style={{position: 'absolute', top: '40px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderDays(firstMoment, numberOfDaysToShow)}
          </div>
          <div style={{position: 'absolute', top: topHandoutLines + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderReservations(allLayoutedReservationFrames, firstMoment, lastMoment, this.props.timeline_availability, this.state.preprocessedData.invalidReservations)}
          </div>
          <div style={{position: 'absolute', top: topFreeItems + 'px', left: '0px', width: wholeWidth + 'px', bottom: '0px'}}>
            {this.renderLabel(firstMoment, 'Verfügbar:')}
            {this.renderIndexedQuantities((i) => unusedCounts[i], firstMoment, lastMoment, unusedColors)}
          </div>
          {this.renderEntitlementQuantities(this.props.timeline_availability, this.state.preprocessedData.changesForDays, reservationsInGroups, entitlementQuantities, topFreeItems, wholeWidth, firstMoment, lastMoment, relevantItemsCount)}
        </div>
      )
    }
  })
})()
