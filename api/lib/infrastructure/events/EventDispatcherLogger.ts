// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
class EventDispatcherLogger {
  _monitoringTools: any;
  _performance: any;
  _settings: any;
  constructor(monitoringTools: any, settings: any, performance: any) {
    this._monitoringTools = monitoringTools;
    this._settings = settings;
    this._performance = performance;
  }

  onEventDispatchStarted(event: any, eventHandlerName: any) {
    if (this._settings?.logging?.enableLogStartingEventDispatch) {
      this._monitoringTools.logInfoWithCorrelationIds({
        ...buildLogBody({ event, eventHandlerName }),
        message: 'EventDispatcher : Event dispatch started',
      });
    }
    return {
      startedAt: this._performance.now(),
    };
  }

  onEventDispatchSuccess(event: any, eventHandlerName: any, loggingContext: any) {
    if (this._settings?.logging?.enableLogEndingEventDispatch) {
      this._monitoringTools.logInfoWithCorrelationIds({
        ...buildLogBody({ event, eventHandlerName, duration: this._duration(loggingContext) }),
        message: 'EventDispatcher : Event dispatched successfully',
      });
    }
  }

  onEventDispatchFailure(event: any, eventHandlerName: any, error: any) {
    if (this._settings?.logging?.enableLogEndingEventDispatch) {
      this._monitoringTools.logInfoWithCorrelationIds({
        ...buildLogBody({ event, eventHandlerName, error }),
        message: 'EventDispatcher : An error occurred while dispatching the event',
      });
    }
  }

  _duration(context: any) {
    return context?.startedAt ? this._performance.now() - context.startedAt : undefined;
  }
}

function buildLogBody({
  event,
  eventHandlerName,
  error,
  duration
}: any) {
  return {
    metrics: {
      event_name: event.constructor.name,
      event_content: event,
      event_handler_name: eventHandlerName,
      event_error: error?.message ? error.message + ' (see dedicated log for more information)' : undefined,
      event_handling_duration: duration,
    },
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EventDispatcherLogger;
