import { LightningElement, api, track } from 'lwc';

export default class SharedPosted extends LightningElement {
    
    value = '';
    show = false;
    @track postData = [];
    items = [];
    commentCount = 0;
    id = 0;
    
    get options() {
        return [
            { label: 'Top Posts', value: 'toppost' },
            { label: 'Latest Posts', value: 'latestpost' },
            { label: 'Most Recent Activity', value: 'mostrecenty_activity' },
        ];
    }
    
    optionChangeHandler(event) {
        this.value = event.target.value;
        this.filterByOptions(this.value);
    }

    searchChangeHandler(event) {
        let query = event.target.value;
        let keycode = event.which;
        if (keycode == 13) {
            console.log(`query: ${query}`)
            const fieldToSearch = ["post"];
            this.searchList(this.postData, query, fieldToSearch);
        }
        let crossbtn = this.template.querySelector(`[data-element-id="searchClear"]`);
        console.log(crossbtn);
    }
    

    refreshFeedsHandler(event) {
        this.postData = JSON.parse(JSON.stringify(this.items));
    }

    @api
    sharedPost(richTextValue) {
        this.id = this.id + 1;
        this.id > 0 ? this.show = true : this.show = false;
        const timestamp = this.getDateTime();
        this.insertdata(this.id, richTextValue, timestamp);
    }


    editHandler(event) {
        let id = event.detail.postid;
    }

    deleteHandler(event) {
        let id = event.detail.postid;
        this.postData = this.items.filter((element) => {
            return element.id !== parseInt(id);
        });
        if (this.postData.length === 0)
            this.show = false

        this.items = this.postData;
    }

    bookmarkHandler(event) {
        let id = event.detail.postid;
    }

    
    // Add post data 
    insertdata(id, richTextValue, timestamp) {
        this.items.unshift({ id: id, post: richTextValue, timestamp: timestamp, comments: [] })        
        this.postData = JSON.parse(JSON.stringify(this.items));
    }
    
    // Add comment to individualy post
    insertcomment(event) {
        let id = event.detail.id;
        let comment = event.detail.comment;

        this.items.forEach((ele, index) => {
            const timestamp = this.getDateTime();
            if (id == ele.id)
                ele.comments.push({ timestamp: timestamp, comment: comment });
        })
        this.items = this.items.map((ele, index) => ({ ...ele, count: ele.comments.length}));
        
        this.postData = JSON.parse(JSON.stringify(this.items));
    }

    // filter by options
    filterByOptions(options) {
        console.log('filter by', options);
        if (options == 'toppost') {
            this.postData = this.items;
            var i, j, temp, swapped;
            let n = this.items.length;
            for (i = 0; i < n - 1; i++) {
                swapped = false;
                for (j = 0; j < n - i - 1; j++) {
                    if (this.postData[j].count < this.postData[j + 1].count) {
                        temp = this.postData[j];
                        this.postData[j] = this.postData[j + 1];
                        this.postData[j + 1] = temp;
                        swapped = true;
                    }
                }
                if (swapped == false)
                    break;

            }
        }
        if (options == 'latestpost') {
            // var startDate = new Date().toJSON().slice(0, 10);
            // this.postData = this.items.filter((item) => {
            //     return item.timestamp.toJSON().slice(0, 10) == startDate;
            // });

            this.postData = this.items.slice(0, 5);
        }

        // if (options == 'mostrecenty_activity') {
            
        // }
    }

    // Search feed
    searchList(data, query, fieldToSearch) {
        const result = [];
        function search(obj) {
            for (const key in obj) {
                const value = obj[key];
                if (fieldToSearch.includes(key) && value.toString().toLowerCase().includes(query.toLowerCase())) {
                    result.unshift(obj);
                    break;
                }
                if (typeof value == 'object') {
                    search(value);
                } else if (Array.isArray(value)) {
                    value.forEach(search);
                }
            }
        }
        search(data);
        // return result;
        this.postData = result.reverse();
    }

    // Get today date time 
    getDateTime() {
        let todays = new Date();
        return todays;

    }
}