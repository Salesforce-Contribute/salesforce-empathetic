import { LightningElement } from 'lwc';

const gridColumns= [
    {type: 'text', fieldName: 'col1', label: 'Name', sortable:true, link:true},
    {type: 'text', fieldName: 'col2', label: 'Email', sortable:true},
    {type: 'text', fieldName: 'col3', label: 'Phone', sortable:true},
    {type: 'text', fieldName: 'col4', label: 'Type', sortable:true},
    {type: 'text', fieldName: 'col5', label: 'Industry', sortable:true},
    {type: 'text', fieldName: 'col6', label: 'Ownership', sortable:true},
    {type: 'text', fieldName: 'col7', label: 'Rating', sortable:true},
    {type: 'text', fieldName: 'col8', label: 'CreatedDate', sortable:true},
    {type: 'action', label:'Action', typeAttributes: { rowActions: [
        { label: 'Create', name: 'create' },
        { label: 'Edit', name: 'edit' }]
    }}
];

export default class MainTreeGrid extends LightningElement {
  columns = gridColumns;
  threadList = [];
  threadSortDirection;
  threadSortedBy;
  actionItem;
  
  handleEdit(event) {
      // event.detail.id
  }
  handleDelete(event) {
      // event.detail.id
  }

  connectedCallback() {

    this.threadList = [
      {
        "Id": "1",
        "col1": "GenePoint",
        "col2": "test1@gmail.com",
        "col3": "(415) 555-1212",
        "col4": "Customer - Channel",
        "col5": "Banking",
        "col6": "Private",
        "col7": "Hot",
        "col8": "03/02/2020, 12:00 AM",
        "_children": [
          {
            "Id": "1-A",
            "col1": "Name",
            "col2": "Title",
            "col3": "Email",
            "col4": "Phone",
            "col5": "Lead Source",
            "col6": "Level",
            "col7": "Report To",
            "col8": "CreatedDate",
            "_children": [
              {
                "Id": "1-A-A",
                "col1": "Doglas",
                "col2": "SVP, Technology",
                "col3": "test0005@gmail.com",
                "col4": "(212)-555-83838",
                "col5": "Public Relations",
                "col6": "Secondary",
                "col7": "Lauren Boyle",
                "col8": "03/02/2020, 12:00 AM"
              },
              {
                "Id": "1-A-B",
                "col1": "Rogers",
                "col2": "VP, Facilities",
                "col3": "test0004@gmail.com",
                "col4": "(212)-555-83838",
                "col5": "Partner Referral",
                "col6": "Primary",
                "col7": "Scane Boyle",
                "col8": "05/03/2020, 11:00 AM"
              }
            ]
          }
        ],
      },
      {
        "Id": "2",
        "col1": "United Oil P& Gas, UAE",
        "col2": "test2@gmail.com",
        "col3": "(415) 842-5500",
        "col4": "Customer - Direct",
        "col5": "Energy",
        "col6": "Private",
        "col7": "Warm",
        "col8": "10/11/2019, 03:00 PM",
        "_children": [
          {
            "Id": "2-A",
            "col1": "Name",
            "col2": "Title",
            "col3": "Email",
            "col4": "Phone",
            "col5": "Lead Source",
            "col6": "Level",
            "col7": "Report To",
            "col8": "CreatedDate",
            "_children": [
              {
                "Id": "2-A-A",
                "col1": "Jane gray",
                "col2": "Dean of Administration",
                "col3": "test007@gmail.com",
                "col4": "(212)-125-83838",
                "col5": "Phone Inquiry",
                "col6": "Primary",
                "col7": "Jane gray",
                "col8": "05/03/2020, 11:00 AM"
              },
              {
                "Id": "2-A-B",
                "col1": "Atom smith",
                "col2": "SVP, Technology",
                "col3": "test008@gmail.com",
                "col4": "(212)-555-83838",
                "col5": "Web",
                "col6": "Tertiary",
                "col7": "Atom smith",
                "col8": "05/05/2021, 03:00 AM"
              }
            ]
          }
        ],
      }
    ]
  }

  handleRowAction(event) {
    this.actionItem = JSON.stringify(event.detail.row);
  }

  handleRowSelect(event) {
    this.actionItem = JSON.stringify(event.detail.row);
  }

  onSortList(event) {
    let fieldName = event.detail.sortedBy;
    let sortDirection = event.detail.sortDirection;
    this.sortData(fieldName, sortDirection);
    this.sortBy = fieldName;
    this.sortDirection = sortDirection;
  }

  sortData(fieldName, sortDirection) {
    let sortResult = this.threadList;
    let sorted = sortResult.sort(function (a, b) {
    if (a[fieldName] < b[fieldName])
        return sortDirection === 'desc' ? 1 : -1;
    else if (a[fieldName] > b[fieldName])
        return sortDirection === 'desc' ? -1 : 1;
    else
        return 0;
    })
    this.threadList = JSON.parse(JSON.stringify(sorted));
  }


    // sortBy(field, reverse, primer) {
    //   console.log('field: '+ field, ' reverse: '+ reverse, ' primer: '+ primer);
    //   const key = x => primer ?  primer(x[field]) : x[field];
    //   return function (a, b) {
    //       a = key(a);
    //       b = key(b);
    //       return reverse * ((a > b) - (b > a));
    //   };
    // }

    // sortHandler(e,d) {
    //   const { sortedBy, sortDirection } = e.detail;
    //   d.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1, ''));
    //   return { sortedField: sortedBy, sortedList: d, sortedDirection: sortDirection };
    // }

    // onSortList(e) {
    //   let { sortedField, sortedList, sortedDirection } = this.sortHandler(e, [...this.threadList]);
    //   this.threadSortedBy = sortedField;
    //   this.threadList = sortedList;
    //   this.threadSortDirection = sortedDirection;
    // }
}