/************************************************* BUDGET Controller *************************************************/

const budgetController = function () {

    class Expense {
        constructor(type, id, description, value) {
            this.type = type;
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };

        calcPercentage = (totalIncome) => {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
        };

        getPercentage = () => {
            return this.percentage;
        };
    };


    class Income {
        constructor(type, id, description, value) {
            this.type = type;
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    
    // budget
    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach(el => {
            sum += el.value;
        });
        data.totals[type] = sum;
    }


    // Data Structure
    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };


    const printData = () => {
        console.log(`data:`);
        console.log(data);
    };


    return {
        getData: () => {
            printData();
        },


        addItem: (type, desc, val) => {
            let newItem, id;

            // create new id
            id = (data.allItems[type].length > 0) ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

            // create new item based on the type
            if (type === 'exp') {
                newItem = new Expense(type, id, desc, val);

            } else if (type === 'inc') {
                newItem = new Income(type, id, desc, val);

            } else {
                console.log(`Error: budgetController.addItem(),type: ${type}`);
            }

            // add new item to data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },


        // items
        deleteItem: (type, ID) => {
            // ids Array
            const ids = data.allItems[type].map((el) => {
                return el.id;
            });
            // index of ID
            let index = ids.indexOf(ID);

            if (index !== -1) data.allItems[type].splice(index, 1);
        },


        // budget
        calculateBudget: () => {

            // 1. calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate the percentage of income we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },


        // item percentages
        calculatePercentages: () => {
            data.allItems.exp.forEach((el) => {
                el.calcPercentage(data.totals.inc);
            });
        },


        // item percentages
        getPercentages: () => {
            const allPerc = data.allItems.exp.map((el) => {
                return el.getPercentage();
            });
            return allPerc;
        },


        // budget
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    };
}();



/********************************************** USER INTERFACE Controller ********************************************/
const UIController = function () {


    // DOM elements:
    const DOMelements = {
        // input elements
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        // item lists
        incomContainer: '.income__list',
        expensesContainer: '.expenses__list',
        // budget totals
        budget: '.budget__value',
        budgetInc: '.budget__income--value',
        budgetExp: '.budget__expenses--value',
        budgetPerc: '.budget__expenses--percentage',
        // Item container
        container: '.container',
        // item percentage
        expensesItemPrec: '.item__percentage',
        // Date
        date: '.budget__title--date'
    };


    // format numbers
    const formatNumber = (type, num) => {

        let newNum = Math.abs(num).toFixed(2);

        let [integer, decimal] = newNum.split('.');
        integer = integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        let sign = (type === 'exp') ? '-' : '+';

        let formatedNumber = `${sign} ${integer}.${decimal}`;

        return formatedNumber;
    };


    // node list function
    const nodeListForEach = function (nodeList, callback) {
        for (let i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
        }
    };


    return {

        // input
        getinput: () => {
            return {
                type: document.querySelector(DOMelements.inputType).value,
                description: document.querySelector(DOMelements.inputDescription).value,
                value: parseFloat(document.querySelector(DOMelements.inputValue).value)
            }
        },


        // list item
        addListItem: (item) => {
            let html;
            let element = (item.type === 'exp') ? DOMelements.expensesContainer : DOMelements.incomContainer;


            // create HTML string with placeholder text
            if (item.type === 'inc') {
                html = `<div class="item clearfix" id="inc-${item.id}">
                            <div class="item__description">${item.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber('inc', item.value)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`

            } else if (item.type === 'exp') {

                html = `<div class="item clearfix" id="exp-${item.id}">
                            <div class="item__description">${item.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber('exp', item.value)}</div>
                                <div class="item__percentage">10%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            };

            // insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },


        // list item
        deleteListItem: (elementID) => {
            let element = document.getElementById(elementID);
            element.parentNode.removeChild(element);
        },


        //input fields
        clearFields: () => {
            // nodelist
            const fields = document.querySelectorAll(`${DOMelements.inputDescription}, ${DOMelements.inputValue}`);

            // array from nodelist
            const fieldsArray = [...fields];

            // clear input value
            fieldsArray.forEach(el => el.value = '');

            // focus on field
            fieldsArray[0].focus();
        },


        // budget
        displayBudget: (newBudget) => {

            let type = (newBudget.budget >= 0) ? 'inc' : 'exp';

            document.querySelector(DOMelements.budget).textContent = formatNumber(type, newBudget.budget);
            document.querySelector(DOMelements.budgetInc).textContent = formatNumber('inc', newBudget.totalInc);
            document.querySelector(DOMelements.budgetExp).textContent = formatNumber('exp', newBudget.totalExp);


            if (parseInt(newBudget.percentage) > 0) {
                document.querySelector(DOMelements.budgetPerc).textContent = newBudget.percentage + '%';
            } else {
                document.querySelector(DOMelements.budgetPerc).textContent = '--';
            }
        },


        // dislaying item percentages
        displayItemPercentages: (percentageArr) => {

            // nodelist
            let fields = document.querySelectorAll(DOMelements.expensesItemPrec);

            //callback function for nodelist items
            nodeListForEach(fields, (current, index) => {
                if (percentageArr[index] > 0) {
                    current.textContent = `${percentageArr[index]}%`;
                } else {
                    current.textContent = '--';
                }
            });
        },


        // date
        displayDate: () => {

            const now = new Date();
            let day = now.getDate();
            let month = now.getMonth();
            let year = now.getFullYear();

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMelements.date).textContent = `${day} ${months[month]} ${year}`;
        },


        //input high light
        highLight: () => {
            //node list
            const fields = document.querySelectorAll(`${DOMelements.inputType}, ${DOMelements.inputDescription}, ${DOMelements.inputValue}`);

            // callback for the node list
            nodeListForEach(fields, (el) => {
                el.classList.toggle('red-focus');
            });

            //input button
            document.querySelector(DOMelements.inputButton).classList.toggle('red');
        },


        // DOM elements
        getDOMelements: () => {
            return DOMelements;
        }
    }
}();



/************************************************ MAIN APP Controller ************************************************/
const Controller = function (budgetCtrl, UICtrl) {


    // events
    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMelements();

        // input
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        //list items
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        // high light input
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.highLight);
    };


    // verification of input
    const empty = (input) => {
        if (input !== null && input !== '') {
            return true;
        } else {
            return false;
        }
    };


    // budget
    const updateBudget = () => {

        // 1. Calculate the Budget
        budgetController.calculateBudget()

        // 2. return the budget, total inc, total exp & percentage
        let budget = budgetCtrl.getBudget();

        // 3. update the UI (new budget)
        UICtrl.displayBudget(budget);

    };


    // percentages
    const updatePercentages = () => {

        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read from the budget controller
        const itemsPerc = budgetCtrl.getPercentages();

        // 3. update the UI
        // console.log(itemsPerc);
        UICtrl.displayItemPercentages(itemsPerc);
    };


    // list item
    const ctrlAddItem = () => {

        // 1. get data from the input field
        const input = UICtrl.getinput();

        if (empty(input.description) && empty(input.value) && input.value > 0) {

            // 2. add the item to the BUDGET controller
            const newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add the new item to the UI Controller
            UICtrl.addListItem(newItem);

            // 4. empty input fields
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();

            // 6. calculate and update percentages
            updatePercentages();
        }
    };


    // list item
    const ctrlDeleteItem = (e) => {

        let itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            const arr = itemId.split('-');
            let type = arr[0];
            let id = parseInt(arr[1]);

            // 1. delete item from data
            budgetCtrl.deleteItem(type, id);

            // 2. update UI
            UICtrl.deleteListItem(itemId);

            // 3. update budget
            updateBudget();

            // 4. calculate and update percentages
            updatePercentages();
        }
    };


    return {
        init: () => {
            console.log('app started');
            UIController.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };
}(budgetController, UIController);

Controller.init();