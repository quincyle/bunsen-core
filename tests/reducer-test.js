var expect = require('chai').expect
var reducer = require('../lib/reducer').reducer
var actions = require('../lib/actions')

describe('initial state', function () {
  it('should be what we want', function () {
    var initialState = reducer({}, {type: '@@redux/INIT'})

    expect(initialState.errors).to.eql({})
    expect(initialState.validationResult).to.eql({warnings: [], errors: []})
    expect(initialState.value).to.eql(null)
  })
})

describe('value manipulation', function () {
  it('can change a value', function () {
    var initialState = {
      errors: {},
      validationResult: {warnings: [], errors: []},
      value: {
        foo: 12,
        bar: {
          qux: 'cheese'
        }
      },
      baseModel: {}
    }
    var changedState = reducer(initialState, {type: actions.CHANGE_VALUE, value: 'wine', bunsenId: 'bar.qux'})
    expect(changedState.value.bar.qux).to.eql('wine')
    expect(changedState.value.foo).to.eql(12)
  })

  it('can remove a value', function () {
    var initialState = {
      errors: {},
      validationResult: {warnings: [], errors: []},
      value: {
        foo: 12,
        bar: {
          qux: 'cheese'
        }
      },
      baseModel: {}
    }
    var changedState = reducer(initialState, {type: actions.CHANGE_VALUE, value: '', bunsenId: 'bar.qux'})
    expect(changedState.value).to.eql({foo: 12, bar: {}})
  })

  it('can set the entire value', function () {
    var initialState = {
      errors: {},
      validationResult: {warnings: [], errors: []},
      value: {
        foo: 12,
        bar: {
          qux: 'cheese'
        }
      },
      baseModel: {}
    }
    var changedState = reducer(initialState, {type: actions.CHANGE_VALUE, value: {baz: 22}, bunsenId: null})
    expect(changedState.value).to.eql({baz: 22})
  })

  it('will prune all the dead wood when setting root object', function () {
    var initialState = {
      errors: {},
      validationResult: {warnings: [], errors: []},
      value: null,
      baseModel: {}
    }
    var newValue = {
      foo: {
        bar: {
          baz: null,
          qux: 12
        },
        waldo: null,
        buzz: true,
        fizz: false
      }
    }

    var changedState = reducer(initialState, {type: actions.CHANGE_VALUE, value: newValue, bunsenId: null})
    expect(changedState.value).to.eql({foo: {bar: {qux: 12}, buzz: true, fizz: false}})
  })

  it('will prune all the dead wood out of a complex array', function () {
    var initialState = {
      errors: {},
      validationResult: {warnings: [], errors: []},
      value: null,
      baseModel: {}
    }
    var newValue = {
      a: {
        b1: [
          {c1: {
            d: null
          }},
          {c2: 12},
          {c3: [1, 2, 3]}
        ],
        b2: []
      }
    }

    var changedState = reducer(initialState, {type: actions.CHANGE_VALUE, value: newValue, bunsenId: null})
    expect(changedState.value).to.eql({a: {b1: [{c1: {}}, {c2: 12}, {c3: [1, 2, 3]}]}})
  })
})

describe('can set the validation', function () {
  it('basic functionality', function () {
    var initialState = {
      errors: ['this is broken'],
      validationResult: ['this sucks'],
      value: {},
      baseModel: {}
    }
    var changedState = reducer(initialState, {
      type: actions.VALIDATION_RESOLVED, errors: [], validationResult: ['you look kinda fat']
    })

    expect(changedState).to.eql({
      errors: [],
      validationResult: ['you look kinda fat'],
      value: {},
      baseModel: {}
    })
  })
})
