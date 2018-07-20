// EventListener | CC0 | github.com/jonathantneal/EventListener
this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener && (function() {
    function addToPrototype(name, method) {
        Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
    }
    addToPrototype("addEventListener", function(type, listener) { // add
        var target = this,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];
        // if no events exist, attach the listener
        if (!typeListeners.length) {
            target.attachEvent("on" + type, typeListeners.event = function(event) {
                var documentElement = target.document && target.document.documentElement || target.documentElement || {
                    scrollLeft: 0,
                    scrollTop: 0
                };

                // polyfill w3c properties and methods
                event.currentTarget = target;
                event.pageX = event.clientX + documentElement.scrollLeft;
                event.pageY = event.clientY + documentElement.scrollTop;
                event.preventDefault = function() {
                    event.returnValue = false
                };
                event.relatedTarget = event.fromElement || null;
                event.stopImmediatePropagation = function() {
                    immediatePropagation = false;
                    event.cancelBubble = true
                };
                event.stopPropagation = function() {
                    event.cancelBubble = true
                };
                event.target = event.srcElement || target;
                event.timeStamp = +new Date;

                var plainEvt = {};
                for (var i in event) {
                    plainEvt[i] = event[i];
                }

                // create an cached list of the master events list (to protect this loop from breaking when an event is removed)
                for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
                    // check to see if the cached event still exists in the master events list
                    for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
                        if (typeListener == typeListenerCache) {
                            typeListener.call(target, plainEvt);

                            break;
                        }
                    }
                }
            });
        }
        // add the event to the master event list
        typeListeners.push(listener);
    });
    addToPrototype("removeEventListener", function(type, listener) { // remove
        var target = this,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];

        // remove the newest matching event from the master event list
        for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
            if (typeListener == listener) {
                typeListeners.splice(i, 1);

                break;
            }
        }

        // if no events exist, detach the listener
        if (!typeListeners.length && typeListeners.event) {
            target.detachEvent("on" + type, typeListeners.event);
        }
    });
    addToPrototype("dispatchEvent", function(eventObject) { // dispatch
        var target = this,
            type = eventObject.type,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];
        try {
            return target.fireEvent("on" + type, eventObject);
        } catch (error) {
            if (typeListeners.event) {
                typeListeners.event(eventObject);
            }
            return;
        }
    });
    Object.defineProperty(Window.prototype, "CustomEvent", { // CustomEvent
        get: function() {
            var self = this;

            return function CustomEvent(type, eventInitDict) {
                var event = self.document.createEventObject(),
                    key;

                event.type = type;
                for (key in eventInitDict) {
                    if (key == 'cancelable') {
                        event.returnValue = !eventInitDict.cancelable;
                    } else if (key == 'bubbles') {
                        event.cancelBubble = !eventInitDict.bubbles;
                    } else if (key == 'detail') {
                        event.detail = eventInitDict.detail;
                    }
                }
                return event;
            };
        }
    });
    function ready(event) { // ready
        if (ready.interval && document.body) {
            ready.interval = clearInterval(ready.interval);
            document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
        }
    }
    ready.interval = setInterval(ready, 1);
    window.addEventListener("load", ready);
})();

(!this.CustomEvent || typeof this.CustomEvent === "object") && (function() { // CustomEvent for browsers which don't natively support the Constructor method
    this.CustomEvent = function CustomEvent(type, eventInitDict) {
        var event;
        eventInitDict = eventInitDict || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
        } catch (error) {
            // for browsers which don't support CustomEvent at all, we use a regular event instead
            event = document.createEvent('Event');
            event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
            event.detail = eventInitDict.detail;
        }

        return event;
    };
})();
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
