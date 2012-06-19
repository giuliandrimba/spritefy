class PubSub
  
  listeners = []

  constructor:->

  bind:(event,callback)->
    listeners.push({event:event,callback:callback})

  trigger:(event, params)->
    for e in listeners
    	e.callback(params) if e.event is event

  unbind:(event, callback)->
    for e, i in listeners
    	listeners.slice(i,0) if e.event is event and e.callback() is callback()