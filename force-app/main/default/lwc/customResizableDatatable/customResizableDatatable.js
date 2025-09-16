import { LightningElement, api, track } from 'lwc';

export default class CustomResizableDatatable extends LightningElement {

    @api columns = [];
    @api listItem = [];
    @track resizing = false;
    @track startX;
    @track startWidth;
    @track resizingField;

    handleResize(event) {
        this.resizing = true;
        this.resizingField = event.target.dataset.field;
        this.startX = event.clientX;
        const col = this.columns.find(c => c.fieldName === this.resizingField);
        this.startWidth = col.width || 150;
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event) => {
        if (!this.resizing) return;
        const diff = event.clientX - this.startX;
        const colIndex = this.columns.findIndex(c => c.fieldName === this.resizingField);
        if (colIndex !== -1) {
            const newWidth = Math.max(50, this.startWidth + diff);
            this.columns = this.columns.map((col, idx) =>
                idx === colIndex ? { ...col, width: newWidth, widthStyle: `width:${newWidth}px; min-width:${newWidth}px;` } : col
            );
        }
    };

    onMouseUp = () => {
        this.resizing = false;
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    };

    handleEdit(event) {
        const rowId = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent('edit', { detail: { id: rowId } }));
    }

    handleDelete(event) {
        const rowId = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent('delete', { detail: { id: rowId } }));
    }
}