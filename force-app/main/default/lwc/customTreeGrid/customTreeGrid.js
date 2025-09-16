import { LightningElement, api } from 'lwc';

export default class CustomTreeGrid extends LightningElement {
    // @api tableColumns;
    labelList=[];
    dataList=[];
    @api hideCheckboxColumn;

    sortIconName = 'utility:arrowdown';
    iconTitle = 'arrowdown';
    expandIconName = 'utility:chevronright';
    expandIcontitle = 'chevronright';
    label=[];
    rowAction;

    fixedWidth = "width:200px";

    @api
    set tableColumns(value) {
        this.labelList = value.map(column=>{
            let labelObj = {...column}
            labelObj.hoverClass = 'slds-hide';
            labelObj.sortIconName = 'utility:arrowdown';
            labelObj.sortIconTitle = 'arrowdown';
            if(labelObj.hasOwnProperty('typeAttributes')) {
                this.rowAction = labelObj.typeAttributes.rowActions;
            }
            return labelObj;
        });
    }

    get tableColumns() {
        return this.labelList;
    }

    @api
    set tableData(value) {
        if(value != undefined) {
            this.dataList = this.iterateNestedData(value);
        }
    }

    get tableData() {
        return this.dataList;
    }

    get hideColumn() {
        if(this.hideCheckboxColumn=="true") {
            return false;
        } else {
            return true;
        }
    }

    iterateNestedData(data) {
        const dataList = data.map((item, index) => {
            let obj = {...item}
            // console.log('smturl: '+ obj.smturl);
            if(obj.hasOwnProperty('_children')) {
                obj.isExpand = false;
                obj.rowNumber = index+1;
                obj.expandIconName = 'utility:chevronright';
                obj.expandIcontitle = 'chevronright';
                // obj.smturl = obj.smturl.includes('Thread Created Date') ? '#' : obj.smturl;
            }
            obj.isSelected = false;
            obj.menuClass = 'slds-dropdown-trigger slds-dropdown-trigger_click';
            obj.rowAction = this.rowAction;
            // Check if the current item has children and recursively process them
            if(item.hasOwnProperty('_children')) {
                obj._children = this.iterateNestedData(obj._children); // Recursive call for children
            }
            return obj;
        });
        return dataList;
    }    

    mouseEnter(event) {
        this.labelList.map(column=>{
            if(event.target.dataset.label == column.fieldName){
                column.hoverClass = 'slds-show';
            }
        });
        this.labelList = [...this.labelList];
    }

    mouseOut(event) {
        this.labelList.map(column=>{
            if(event.target.dataset.label != column.fieldName){
                column.hoverClass = 'slds-hide';
            }
        });
        this.labelList = [...this.labelList];
    }

    mouseLeave(event) {
        this.labelList.map(column=>{
            if(event.target.dataset.label == column.fieldName){
                column.hoverClass = 'slds-hide';
            }
        });
        this.labelList = [...this.labelList];
    }

    sortByColumn(event) {
        const columnname = event.target.dataset.label
        const iconName = event.target.dataset.iconName;
        let sortDirection = 'asc';
        this.labelList.map(column=>{
            if(event.target.dataset.label == column.fieldName && column.sortIconName == 'utility:arrowdown'){
                column.sortIconName = 'utility:arrowup';
                column.sortIconTitle = 'arrowup';
            } else {
                column.sortIconName = 'utility:arrowdown';
                column.sortIconTitle = 'arrowdown';
            }
        });
        this.labelList = [...this.labelList];
        if(iconName === 'arrowdown') {
            sortDirection = 'asc';
        } else {
            sortDirection =  'desc';
        }
        const columnEvent = new CustomEvent("sort", { detail:{sortedBy:columnname, sortDirection:sortDirection }});
        this.dispatchEvent(columnEvent);
    }

    // isAllChecked=false;
    // selectAllHandler(event) {
    //     this.isAllChecked = event.target.checked;
    //     let isHeader = event.target.dataset.Id;
    //     this.dataList = this.selecteAllRow(this.dataList, isHeader);
    // }
    // selecteAllRow(data, isheader) {
    //     const dataList = data.map((item, index) => {
    //         item.isSelected = !item.isSelected;
    //         if(item.hasOwnProperty('_children')) {
    //             item._children = this.selecteAllRow(item._children); // Recursive call for children
    //         }
    //         return item;
    //     });
    //     return dataList;
    // }
    selectedrow=null;
    singleSelection(event) {
        let singleselection = event.target.checked;
        let rowid = event.target.dataset.Id;
        this.dataList = this.selecteSingleRow(this.dataList, rowid);
        if(this.selectedrow != null && singleselection) {
            const rowselect = new CustomEvent("rowselect", { detail:this.selectedrow});
            this.dispatchEvent(rowselect);
        }
    }

    selecteSingleRow(data, rowid) {
        const dataList = data.map((item, index) => {
            if(rowid==item.Id)
                item.isSelected = true
            else {
                item.isSelected = false;
            }
            if(item.hasOwnProperty('_children')) {
                item._children = this.selecteSingleRow(item._children, rowid); // Recursive call for children
            }
            if(item.Id==rowid) {
                this.selectedrow = {...this.selectedrow, Id:item.Id, col1:item.col1, col2:item.col2, col3:item.col3, col4:item.col4, col5:item.col5, col6:item.col6, col7:item.col7, col8:item.col8, col9:item.col9, col10:item.col10, smtId:item.smtId};
            }
            return item;
            
        });
        return dataList;
    }

    
    toggleExpand(event) {
        const rowKeyValue = event.target.dataset.rowKeyValue;
        this.dataList = this.nestedData(this.dataList, rowKeyValue);
    }
    
    nestedData(data, rowKeyValue) {
        const dataList = data.map((item, index) => {
            if(item.hasOwnProperty('_children')) {
                if((item.Id === rowKeyValue) && (item.isExpand === false)) {
                    item.isExpand = true;
                    item.expandIconName = 'utility:chevrondown';
                    item.expandIconTitle = 'chevrondown';
                }
                else if((item.Id === rowKeyValue) && (item.isExpand === true)) {
                    item.isExpand = false;
                    item.expandIconName = 'utility:chevronright';
                    item.expandIconTitle = 'chevronright';
                }
            }
            if(item.hasOwnProperty('_children')) {
                item._children = this.nestedData(item._children, rowKeyValue); // Recursive call for children
            }
            return item;
        });
        return dataList;
    } 


    // clickmenuitem(event) {
    //     const rowId = event.target.dataset.menuId;
    //     this.dataList = this.addMenuClass(this.dataList, rowId);
    //     const selectedItem = {action:{label:event.target.dataset.menuLabel, name:event.target.dataset.menuName}, row:this.rowActionItem}
    //     if(this.rowActionItem != null) {
    //         const actionEvent = new CustomEvent("rowaction", { detail:selectedItem});
    //         this.dispatchEvent(actionEvent);
    //     }
    // }

    // addMenuClass(data, rowid) {
    //     const dataList = data.map((item, index) => {
    //         if(rowid==item.Id)
    //             item.menuClass = 'slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'
    //         else {
    //             item.menuClass = 'slds-dropdown-trigger slds-dropdown-trigger_click'
    //         }
    //         if(item.hasOwnProperty('_children')) {
    //             item._children = this.addMenuClass(item._children, rowid); // Recursive call for children
    //         }            
    //     });
    //     return dataList;
    // }

    // removeMenuClass(data, rowid) {
    //     const dataList = data.map((item, index) => {
            
    //         item.menuClass = 'slds-dropdown-trigger slds-dropdown-trigger_click'
    //         if(item.hasOwnProperty('_children')) {
    //             item._children = this.removeMenuClass(item._children, rowid); // Recursive call for children
    //         }
            
    //     });
    //     return dataList;
    // }

    rowActionItem={};
    clickmenuitem(event) {
        const rowId = event.target.dataset.menuId;
        this.menuRowAction(this.dataList, rowId);
        const selectedItem = {action:{label:event.target.dataset.menuLabel, name:event.target.dataset.menuName}, row:this.rowActionItem}
        if(this.rowActionItem != null) {
            const actionEvent = new CustomEvent("rowaction", { detail:selectedItem});
            this.dispatchEvent(actionEvent);
        }
    }

    menuRowAction(data, rowid) {
        const dataList = data.map((item, index) => {
            if(item.hasOwnProperty('_children')) {
                item._children = this.menuRowAction(item._children, rowid); // Recursive call for children
            }
            if(item.Id==rowid) {
                this.rowActionItem = {...this.rowActionItem, Id:item.Id, col1:item.col1, col2:item.col2, col3:item.col3, col4:item.col4, col5:item.col5, col6:item.col6, col7:item.col7, col8:item.col8, col9:item.col9, col10:item.col10, smtId:item.smtId};
            }
            return item;
        });
        return dataList;
    }


    //-------------------------------

    handlemouseup(e) {
        this._tableThColumn = undefined;
        this._tableThInnerDiv = undefined;
        this._pageX = undefined;
        this._tableThWidth = undefined;
    }
    
    handlemousedown(e) {
        if (!this._initWidths) {
            this._initWidths = [];
            let tableThs = this.template.querySelectorAll("table thead .dv-dynamic-width");
        }
    
        this._tableThColumn = e.target.parentElement;
        this._tableThInnerDiv = e.target.parentElement;
        while (this._tableThColumn.tagName !== "TH") {
            this._tableThColumn = this._tableThColumn.parentNode;
        }
        while (!this._tableThInnerDiv.className.includes("slds-cell-fixed")) {
            this._tableThInnerDiv = this._tableThInnerDiv.parentNode;
        }
        this._pageX = e.pageX;
        this._padding = this.paddingDiff(this._tableThColumn);
    
        this._tableThWidth = this._tableThColumn.offsetWidth - this._padding;
    }
    
    handlemousemove(e) {
        if (this._tableThColumn && this._tableThColumn.tagName === "TH") {
            this._diffX = e.pageX - this._pageX;
    
            this.template.querySelector("table").style.width = (this.template.querySelector("table") - (this._diffX)) + 'px';
    
            this._tableThColumn.style.width = (this._tableThWidth + this._diffX) + 'px';
            this._tableThInnerDiv.style.width = this._tableThColumn.style.width;
    
            let tableThs = this.template.querySelectorAll("table thead .dv-dynamic-width");
            let tableBodyRows = this.template.querySelectorAll("table tbody tr");
            let tableBodyTds = this.template.querySelectorAll("table tbody .dv-dynamic-width");
            tableBodyRows.forEach(row => {
                let rowTds = row.querySelectorAll(".dv-dynamic-width");
                rowTds.forEach((td, ind) => {
                    rowTds[ind].style.width = tableThs[ind].style.width;
                });
            });
        }
    }
    
    handledblclickresizable() {
        let tableThs = this.template.querySelectorAll("table thead .dv-dynamic-width");
        let tableBodyRows = this.template.querySelectorAll("table tbody tr");
        tableThs.forEach((th, ind) => {
            th.style.width = this._initWidths[ind];
            th.querySelector(".slds-cell-fixed").style.width = this._initWidths[ind];
        });
        tableBodyRows.forEach(row => {
            let rowTds = row.querySelectorAll(".dv-dynamic-width");
            rowTds.forEach((td, ind) => {
                rowTds[ind].style.width = this._initWidths[ind];
            });
        });
    }
    
    paddingDiff(col) {
    
        if (this.getStyleVal(col, 'box-sizing') === 'border-box') {
            return 0;
        }
    
        this._padLeft = this.getStyleVal(col, 'padding-left');
        this._padRight = this.getStyleVal(col, 'padding-right');
        return (parseInt(this._padLeft, 10) + parseInt(this._padRight, 10));
    
    }
    
    getStyleVal(elm, css) {
        return (window.getComputedStyle(elm, null).getPropertyValue(css))
    }
}