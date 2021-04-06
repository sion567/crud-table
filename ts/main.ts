document.title="CRUD Application using TypeScript";

class Book {
    ID: string;
    bookName: string;
    category: string;
    price: number;
}

class App {
    cols: string[];
    myBooks: Array<Book>;
    category: string[];
    td: HTMLTableCellElement;

    constructor() {
        this.myBooks = [
            { ID: '1', bookName: 'Computer Architecture', category: 'Computers', price: 125.60 },
            { ID: '2', bookName: 'Asp.Net 4 Blue Book', category: 'Programming', price: 56.00 },
            { ID: '3', bookName: 'Popular Science', category: 'Science', price: 210.40 }
        ];
        this.category = ['Business', 'Computers', 'Programming', 'Science'];
        this.cols = []; /** cols一定要初始化，不建议在定义属性的时候直接初始化,而是放到构造函数里.或者像onCreate里面初始化属性的值.   **/
        this.onCreate();
    }

    onCreate() {
        // Extract value for table header.
        for (let book of this.myBooks) {
            for (let key in book) {
                if (this.cols.indexOf(key) === -1) {
                    this.cols.push(key);
                }
            }
        }
        // CREATE A TABLE.
        const table: HTMLTableElement = <HTMLTableElement> document.createElement("table");
        table.setAttribute('id', 'booksTable');     // Seet table id.

        let tr = table.insertRow(-1);               // Create a row (for header).

        for (let col of this.cols) {
            // Add table header.
            let th = document.createElement('th');
            th.innerHTML = col?.replace('_', ' ');
            tr.appendChild(th);
        }

        // Add rows using JSON data.
        this.myBooks.forEach((book, i) => {
            tr = table.insertRow(-1);           // Create a new row.
            for (let col of this.cols) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = book[col];
            }

            // Dynamically create and add elements to table cells with events.
            //tr.dataset.index = 1;
            this.td = document.createElement('td');

            // *** CANCEL OPTION.
            tr.appendChild(this.td);
            var lblCancel = document.createElement('label');
            lblCancel.innerHTML = '✖';
            lblCancel.setAttribute('onclick', 'app.cancel(this)');
            lblCancel.setAttribute('style', 'display:none;');
            lblCancel.setAttribute('title', 'cancel');
            lblCancel.setAttribute('id', 'lbl' + i);
            this.td.appendChild(lblCancel);

            // *** SAVE.
            tr.appendChild(this.td);
            var btSave = document.createElement('input');

            btSave.setAttribute('type', 'button');      // SET ATTRIBUTES.
            btSave.setAttribute('value', 'Save');
            btSave.setAttribute('id', 'Save' + i);
            btSave.setAttribute('style', 'display:none;');
            btSave.setAttribute('onclick', 'app.save(this)');       // ADD THE BUTTON's 'onclick' EVENT.
            this.td.appendChild(btSave);

            // *** UPDATE.
            tr.appendChild(this.td);
            var btUpdate = document.createElement('input');

            btUpdate.setAttribute('type', 'button');    // SET ATTRIBUTES.
            btUpdate.setAttribute('value', 'Update');
            btUpdate.setAttribute('id', 'Edit' + i);
            btUpdate.setAttribute('style', 'background-color:#44CCEB;');
            btUpdate.setAttribute('onclick', 'app.update(this)');   // ADD THE BUTTON's 'onclick' EVENT.
            this.td.appendChild(btUpdate);

            // *** REMOVE.
            this.td = document.createElement('th');
            tr.appendChild(this.td);
            var btRemove = document.createElement('input');
            btRemove.setAttribute('type', 'button');    // SET INPUT ATTRIBUTE.
            btRemove.setAttribute('value', 'Remove');
            btRemove.setAttribute('style', 'background-color:#ED5650;');
            btRemove.setAttribute('onclick', 'app.remove(this)');   // ADD THE BUTTON's 'onclick' EVENT.
            this.td.appendChild(btRemove);
        });

        // ADD A ROW AT THE END WITH BLANK TEXTBOXES AND A DROPDOWN LIST (FOR NEW ENTRY).
        tr = table.insertRow(-1);           // CREATE THE LAST ROW.

        for (let j = 0; j < this.cols.length; j++) {
            let newCell = tr.insertCell(-1);
            if (j >= 1) {
                if (j == 2) {   // WE'LL ADD A DROPDOWN LIST AT THE SECOND COLUMN (FOR Category).
                    let select = document.createElement('select');      // CREATE AND ADD A DROPDOWN LIST.
                    select.innerHTML = '<option value=""></option>';
                    for (let k = 0; k < this.category.length; k++) {
                        select.innerHTML = select.innerHTML +
                            '<option value="' + this.category[k] + '">' + this.category[k] + '</option>';
                    }
                    newCell.appendChild(select);
                } else {
                    var tBox = document.createElement('input');          // CREATE AND ADD A TEXTBOX.
                    tBox.setAttribute('type', 'text');
                    tBox.setAttribute('value', '');
                    newCell.appendChild(tBox);
                }
            }
        }

        this.td = document.createElement('td');
        tr.appendChild(this.td);

        var btNew = document.createElement('input');

        btNew.setAttribute('type', 'button');       // SET ATTRIBUTES.
        btNew.setAttribute('value', 'Create');
        btNew.setAttribute('id', 'New' + (this.myBooks.length + 1));
        btNew.setAttribute('style', 'background-color:#207DD1;');
        btNew.setAttribute('onclick', 'app.createNew(this)');       // ADD THE BUTTON's 'onclick' EVENT.
        this.td.appendChild(btNew);

        var div = document.getElementById('container');
        div.innerHTML = '';
        div.appendChild(table);    // ADD THE TABLE TO THE WEB PAGE.
    }
    cancel(oButton: HTMLButtonElement) {
        // HIDE THIS BUTTON.
        oButton.setAttribute('style', 'display:none; float:none;');
        // HIDE THE SAVE BUTTON.
        let btSave = document.getElementById('Save' + (this.getActiveIndex(oButton) - 1));
        btSave.setAttribute('style', 'display:none;');

        // SHOW THE UPDATE BUTTON AGAIN.
        let btUpdate = document.getElementById('Edit' + (this.getActiveIndex(oButton) - 1));
        btUpdate.setAttribute('style', 'display:block; margin:0 auto; background-color:#44CCEB;');

        const table: HTMLTableElement = <HTMLTableElement>document.getElementById('booksTable');
        let tab = table.rows[this.getActiveIndex(oButton)];

        for (let i = 0; i < this.cols.length; i++) {
            let td = tab.getElementsByTagName("td")[i];
            td.innerHTML = this.myBooks[(this.getActiveIndex(oButton) - 1)][this.cols[i]];
        }
    }
    update(oButton: HTMLButtonElement) {
        const table: HTMLTableElement = <HTMLTableElement>document.getElementById('booksTable');
        let tab = table.rows[this.getActiveIndex(oButton)];

        // SHOW A DROPDOWN LIST WITH A LIST OF CATEGORIES.
        for (let i = 1; i < 4; i++) {
            let td = tab.getElementsByTagName("td")[i];
            let ele: HTMLElement;
            if (i == 2) {
                ele = document.createElement('select');      // DROPDOWN LIST.
                ele.innerHTML = '<option value="' + td.innerText + '">' + td.innerText + '</option>';
                for (let k = 0; k < this.category.length; k++) {
                    ele.innerHTML = ele.innerHTML +
                        '<option value="' + this.category[k] + '">' + this.category[k] + '</option>';
                }
            } else {
                ele = document.createElement('input');      // TEXTBOX.
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', td.innerText);
            }
            td.innerText = '';
            td.appendChild(ele);
        }

        var lblCancel = document.getElementById('lbl' + (this.getActiveIndex(oButton) - 1));
        lblCancel.setAttribute('style', 'cursor:pointer; display:block; width:20px; float:left; position: absolute;');

        var btSave = document.getElementById('Save' + (this.getActiveIndex(oButton) - 1));
        btSave.setAttribute('style', 'display:block; margin-left:30px; float:left; background-color:#2DBF64;');

        // HIDE THIS BUTTON.
        oButton.setAttribute('style', 'display:none;');        
    }
    remove(oButton: HTMLButtonElement) {
        this.myBooks.splice((this.getActiveIndex(oButton) - 1), 1);    // DELETE THE ACTIVE ROW.
        this.onCreate();                         // REFRESH THE TABLE.
    }
    save(oButton: HTMLButtonElement) {
        const table: HTMLTableElement = <HTMLTableElement>document.getElementById('booksTable');
        var tab = table.rows[this.getActiveIndex(oButton)];

        // UPDATE myBooks ARRAY WITH VALUES.
        for (let i = 1; i < this.cols.length; i++) {
            var td = tab.getElementsByTagName("td")[i];
            let el: HTMLElement = <HTMLElement>td.childNodes[0];
            if (el.getAttribute('type') == 'text' || el.tagName == 'SELECT') {  // CHECK IF ELEMENT IS A TEXTBOX OR SELECT.
                this.myBooks[(this.getActiveIndex(oButton) - 1)][this.cols[i]] = el['value'];      // SAVE THE VALUE.
            }
        }
        this.onCreate();     // REFRESH THE TABLE.
    }
    createNew(oButton: HTMLButtonElement) {
        const table: HTMLTableElement = <HTMLTableElement>document.getElementById('booksTable');
        let tab = table.rows[this.getActiveIndex(oButton)];
        let obj: Book = new Book();

        obj[this.cols[0]] = this.myBooks.length + 1;     // NEW ID.
        // ADD NEW VALUE TO myBooks ARRAY.
        for (let i = 1; i < this.cols.length; i++) {
            let td = tab.getElementsByTagName("td")[i];
            let el: HTMLElement = <HTMLElement>td.childNodes[0];
            if (el.getAttribute('type') == 'text' || el.tagName == 'SELECT') {      // CHECK IF ELEMENT IS A TEXTBOX OR SELECT.
                var txtVal = el['value'];
                if (txtVal != '') {
                    obj[this.cols[i]] = txtVal.trim();
                } else {
                    obj = null;
                    alert('all fields are compulsory');
                    break;
                }
            }
        }

        if (Object.keys(obj).length > 0) {      // CHECK IF OBJECT IS NOT EMPTY.
            this.myBooks.push(obj);             // PUSH (ADD) DATA TO THE JSON ARRAY.
            this.onCreate();                 // REFRESH THE TABLE.
        }
    }
    private getActiveIndex(oButton: HTMLButtonElement): number {
        let el = (oButton.parentElement.parentElement) as HTMLTableRowElement;
        return el.rowIndex;
    }
}

let app = new App();