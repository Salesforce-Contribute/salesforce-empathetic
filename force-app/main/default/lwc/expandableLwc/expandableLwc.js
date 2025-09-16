import { LightningElement } from 'lwc';

export default class ExpandableLwc extends LightningElement {
    activeSections = ['tutorialW3web'];
    activeSectionsMessage = '';
 
    toggleSectionHandleW3web(event) {
        const openSections = event.detail.openSections;
 
        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }
}