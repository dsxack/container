class FamilyMember
  getName: ->
    throw new Error "Method must be override"

exports.Homer = (container) ->
  new class Homer extends FamilyMember
    getChild: ->
      return container.make "Child"

    getName: ->
      return "Homer Simpson"

exports.Bart = ->
  return new class Bart extends FamilyMember
    getName: ->
      return "Bart Simpson"

exports.Lisa = ->
  return new class Lisa extends FamilyMember
    getName: ->
      return "Lisa Simpson"

exports.Maggie = ->
  return new class Maggie extends FamilyMember
    getName: ->
      return "Maggie Simpson"
