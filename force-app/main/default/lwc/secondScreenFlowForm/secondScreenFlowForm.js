import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent, FlowNavigationBackEvent, FlowNavigationPauseEvent, FlowNavigationFinishEvent } from 'lightning/flowSupport';

export default class SecondScreenFlowForm extends LightningElement {
  @api
  availableActions = [];

  /**
   * Check availability for the action to avoid errors
   */
  get isNextAction() {
    return this.availableActions.includes('NEXT')
  }

  get isFinishAction() {
    return this.availableActions.includes('FINISH')
  }

  get isPreviousAction() {
    return this.availableActions.includes('BACK')
  }

  get isPauseAction() {
    return this.availableActions.includes('PAUSE')
  }

  /**
   * fire the events
   */
  navigateNextFlowScreen() {
    if (this.isNextAction) {
      const navigateNext = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNext);
    }
  }

  navigatePreviousFlowScreen() {
    if (this.isPreviousAction) {
      const navigateBack = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBack);
    }
  }

  requestPauseFlow() {
    if (this.isPauseAction) {
      const pauseFlow = new FlowNavigationPauseEvent();
      this.dispatchEvent(pauseFlow);
    }
  }

  requestFinishFlow() {
    if (this.isFinishAction) {
      const finishFlow = new FlowNavigationFinishEvent();
      this.dispatchEvent(finishFlow);
    }
  }
}