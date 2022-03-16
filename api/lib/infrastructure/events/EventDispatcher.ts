// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
class EventDispatcher {
  _logger: any;
  _subscriptions: any;
  constructor(logger: any) {
    this._subscriptions = [];
    this._logger = logger;
  }

  subscribe(event: any, eventHandler: any) {
    this._preventDuplicateSubscription(event, eventHandler);
    this._subscriptions.push({ event: event.prototype.constructor, eventHandler: eventHandler });
  }

  _preventDuplicateSubscription(event: any, eventHandler: any) {
    const foundDuplicateSubscription = _.some(this._subscriptions, _.matches({ event, eventHandler }));
    if (foundDuplicateSubscription) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
      throw new Error('Cannot subscribe twice to a given event with the same handler');
    }
  }

  async dispatch(dispatchedEvent: any, domainTransaction: any) {
    const eventQueue = new EventQueue();
    eventQueue.push(dispatchedEvent);

    while (!eventQueue.isEmpty()) {
      const eventToDispatch = eventQueue.shift();
      const eventHandlers = this._findEventHandlersByEventType(eventToDispatch);

      for (const eventHandler of eventHandlers) {
        try {
          const context = this._logger.onEventDispatchStarted(eventToDispatch, eventHandler.handlerName);
          const resultingEventOrEvents = await eventHandler({ domainTransaction, event: eventToDispatch });
          this._logger.onEventDispatchSuccess(eventToDispatch, eventHandler.handlerName, context);

          eventQueue.push(resultingEventOrEvents);
        } catch (error) {
          this._logger.onEventDispatchFailure(eventToDispatch, eventHandler.handlerName, error);
          throw error;
        }
      }
    }
  }

  _findEventHandlersByEventType(eventToDispatch: any) {
    return this._subscriptions
      // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'subscribedEvent' implicitly has a... Remove this comment to see the full error message
      .filter(({ event: subscribedEvent }) => eventToDispatch instanceof subscribedEvent)
      .map((subscription: any) => subscription.eventHandler);
  }
}

class EventQueue {
  events: any;
  constructor() {
    this.events = [];
  }

  push(eventOrEvents: any) {
    if (eventOrEvents) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
      if (!Array.isArray(eventOrEvents)) {
        this.events.push(eventOrEvents);
      } else {
        this.events.push(...eventOrEvents);
      }
    }
  }

  shift() {
    return this.events.shift();
  }

  isEmpty() {
    return this.events.length <= 0;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EventDispatcher;
