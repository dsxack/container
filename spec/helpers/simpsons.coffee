class FamilyMember
  constructor: (@container) ->

  getName: ->
    throw new Error "Method must be override"

class Homer extends FamilyMember
  getChild: ->
    return @container.make "Child"

  getWife: ->
    return @container.make "Wife"

  getName: ->
    return "Homer Simpson"

class Bart extends FamilyMember
  getName: ->
    return "Bart Simpson"

class Lisa extends FamilyMember
  getName: ->
    return "Lisa Simpson"

class Maggie extends FamilyMember
  getName: ->
    return "Maggie Simpson"

class Marge extends FamilyMember
  getName: ->
    return "Marge Simpson"

exports.Homer = (container) -> new Homer(container)
exports.Bart = (container) -> new Bart(container)
exports.Lisa = (container) -> new Lisa(container)
exports.Maggie = (container) -> new Maggie(container)
exports.Marge = (container) -> new Marge(container)