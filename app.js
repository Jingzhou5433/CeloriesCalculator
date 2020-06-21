// Storage ctrl
const StorageCtrl = (function(){
    return{
        storeItem: function(item){
            let items;
            //check if any item in it (localStorage.getItem())
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item)
                //reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItems: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = []
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItem: function(updateditem){
            let items = StorageCtrl.getItems();
            items.forEach(item => {
                if(item.id === updateditem.id){
                    item.name = updateditem.name;
                    item.calories = updateditem.calories;
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItem: function(itemID){
            let items = StorageCtrl.getItems();
            items.forEach((item, index) => {
                if(item.id === itemID){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearAll: function(){
            let items = StorageCtrl.getItems();
            items = [];
            localStorage.setItem('items', JSON.stringify(items));
        }
    }
})();
// Item ctrl
const ItemCtrl = (function(){
    //item constructor
    //id, name, calories
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //data structure/ state
    //items, curr_item, totalCalories
    const data = {
        // items: [
        //     {id: 0, name: 'Steak Dinner', calories: 1200},
        //     {id: 1, name: 'cookie', calories: 500},
        //     {id: 2, name: 'vegetables', calories: 200}
        // ],
        items : StorageCtrl.getItems(),
        currItem : null,
        totalCalories : 0
    }
    
    //return -> data
    return{
        getItems: function(){
            return data.items;
        },

        logData: function(){
            return data;
        },

        getItemsByID: function(ID){
            let found = null;
            data.items.forEach(item => {
                
                if(item.id === parseInt(ID)){
                    found = item;
                }
            });
            return found;
        },

        setCurrItem: function(item){
            data.currItem = item;
        },
        getCurrItem: function(){
            return data.currItem;
        },
        //function --- add item(name, cal)
        addItem: function(name, calories){
            // generate an ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id + 1;
            }else{
                ID = 0;
            }
            
            //convert cal to num
            cal = parseInt(calories);
            //create a new item
            const newItem = new Item(ID, name, cal);
            // push new Item to data
            data.items.push(newItem);
            //return new item
            return newItem;
        },
        updateItem: function(newName, newCalories){
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currItem.id){
                    item.name = newName;
                    item.calories = parseInt(newCalories);
                    found = item;
                }
            });
            return found;
        },
        countCalories: function(){
            let totalCalories = 0;
            data.items.forEach(item => {
                totalCalories += item.calories;
            });
            data.totalCalories = totalCalories;
            return totalCalories;
        },

        deleteItem: function(id){
            let index = 0;
            data.items.forEach(item => {
                if(item.id === id){
                    data.items.splice(index, 1);
                }
                index ++;
            });
            console.log(data.items);
        },

        clearAllItems: function(){
            data.items = [];
        }
            
    }
})();


// UI ctrl
const UICtrl = (function(){
    //UI component frequently used
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        clearBtn: '.clear-btn',
        addBtn: '#item-add',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemInput: '#item-name',
        caloriesInput: '#item-calories',
        alert: '#alert',
        totalCalories: '.total-calories'
    };

    //public
    return{
        //function --- loop through items to fill the list
        fillList: function(items){
            let html = '';

            items.forEach(item => {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}:</strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `
            });
           document.querySelector(UISelector.itemList).innerHTML = html;
        },

        //Get Item Input
        getItemInput: function(){
            const itemInput =  document.querySelector(UISelector.itemInput).value;
            const caloriesInput =  document.querySelector(UISelector.caloriesInput).value;
            return {
                name: itemInput,
                calories: caloriesInput
            };
        },

        showAlert: function(){
            document.querySelector(UISelector.alert).innerHTML = `
                <div class="materialert error">
                <div class="material-icons"></div>
                Incomplete enter!
                </div>
            `;
            setTimeout(function(){
                document.querySelector(UISelector.alert).innerHTML = '';
            }, 2000);
        },

        addlistItem: function(newItem){
            //Create li element
            const li = document.createElement('li');
            //add className
            li.className = "collection-item";
            //add ID(dynamic)
            li.id = `item-${newItem.id}`;
            //add html
            li.innerHTML = `
                <strong>${newItem.name}:     </strong><em>${newItem.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            //insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li);
        },

        updateListItem: function(updatedItem){
            let listItems = document.querySelectorAll(UISelector.listItems);
            
            //Convert the node list to an array
            listItems = Array.from(listItems);

            listItems.forEach(li => {
                const ID = li.getAttribute('id');
                if(ID === `item-${updatedItem.id}`){
                    li.innerHTML = `
                        <strong>${updatedItem.name}:     </strong><em>${updatedItem.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            document.querySelector(itemID).remove();
            
        },

        clearListItems: function(){
            let listItems = document.querySelectorAll(UISelector.listItems);

            listItems.forEach(item => {
                item.remove();
            });

            UICtrl.hideList();
        },

        clearInput: function(){
            document.querySelector(UISelector.itemInput).value = '';
            document.querySelector(UISelector.caloriesInput).value = '';
        },

        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        },

        showList : function(){
            document.querySelector(UISelector.itemList).style.display = 'block';
        },

        showCalories: function(totalCalories){
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },

        showItemInput: function(currItem){
            document.querySelector(UISelector.itemInput).value = currItem.name;
            document.querySelector(UISelector.caloriesInput).value = currItem.calories;
            UICtrl.showEditSate();    
        },
        //clearEditState
        clearEditState: function(){
            //hide all button except the add button
            UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
        },
        showEditSate: function(){
            //show upate / delete / back btns
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
        },
        //function --- return UISelector
        getUISelector: function(){
            return UISelector;
        }

    }
})();


// Main App ctrl
const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl){
    //function --- load event listeners
    function loadEventListener (){
        //const --- get UI selector
        const UISelector = UICtrl.getUISelector();
        //Add item event (add-item btn --- click / ItemAddSubmit)
        document.querySelector(UISelector.addBtn).addEventListener('click', ItemAddSubmit);

        //Disable the Enter key while update the Input
        document.addEventListener('keypress', e=>{
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UISelector.itemList).addEventListener('click', ItemUpdateClick);

        document.querySelector(UISelector.updateBtn).addEventListener('click', ItemUpdateSubmit);

        document.querySelector(UISelector.backBtn).addEventListener('click', backEvent);

        document.querySelector(UISelector.deleteBtn).addEventListener('click', ItemDeleteSubmit);

        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAll);
    }

    //function --- Add item submit
    const ItemAddSubmit = function(event){
        
        //function --- get form input from UICtrl
        const ItemInput = UICtrl.getItemInput();
        
        //check user input is not empty
        if(ItemInput.name !== '' && ItemInput.calories !== ''){
            UICtrl.showList();
            //function --- ItemCtrl /add item
            const newItem = ItemCtrl.addItem(ItemInput.name, ItemInput.calories);
            
            //Add new item to UI list
            UICtrl.addlistItem(newItem);
            
            //calaculate total calories
            const totalCalories = ItemCtrl.countCalories();
            // update the UI of total calories
            UICtrl.showCalories(totalCalories);
            //add item to local stroage
            StorageCtrl.storeItem(newItem);
            //Clear Input
            UICtrl.clearInput();

        }else{
            //show Alert
            UICtrl.showAlert();    
        };

        event.preventDefault();
        
    }

    //function --- update item
    const ItemUpdateClick = function(e){
        console.log("-------ItemUpdateClick-----------");
        if(e.target.classList.contains('edit-item')){   
            //get the current item
            const liID = e.target.parentNode.parentNode.id.split('-')[1];
            console.log(liID);
            //get item
            const itemToEdit = ItemCtrl.getItemsByID(liID);
            
            //set Item
            ItemCtrl.setCurrItem(itemToEdit);
            //Show item in input UI
            UICtrl.showItemInput(itemToEdit);
        }
        e.preventDefault();
    }

    const ItemUpdateSubmit = function(e){
        console.log('update submit');
        
        updateName = UICtrl.getItemInput().name;
        updateCalories = UICtrl.getItemInput().calories;
        //console.log(UICtrl.getItemInput());
        const updatedItem = ItemCtrl.updateItem(updateName, updateCalories);

        //Update the UI
        UICtrl.updateListItem(updatedItem);
        console.log(updatedItem);

        //calaculate total calories
        const totalCalories = ItemCtrl.countCalories();
        // update the UI of total calories
        UICtrl.showCalories(totalCalories);
        
        //update local storage
        StorageCtrl.updateItem(updatedItem);
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const ItemDeleteSubmit = function(e){
        console.log("---------delete event---------");
        
        const currItem = ItemCtrl.getCurrItem();
        console.log(currItem);
        
  
        const itemID = currItem.id;
        console.log(itemID);

        ItemCtrl.deleteItem(itemID);
        
        // delete from UI
        UICtrl.deleteListItem(itemID);

        //calaculate total calories
        const totalCalories = ItemCtrl.countCalories();
        // update the UI of total calories
        UICtrl.showCalories(totalCalories);

        StorageCtrl.deleteItem(itemID);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const backEvent = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const clearAll = function(e){
        //clear from the local data structure
        ItemCtrl.clearAllItems();
        //clear items from the UI
        UICtrl.clearListItems();
        //update the claories
        const totalCalories = ItemCtrl.countCalories();

        StorageCtrl.clearAll();
        // update the UI of total calories
        UICtrl.showCalories(totalCalories);

        e.preventDefault();
    }

    

    //public
    return{
        init: function(){
            UICtrl.clearEditState();

            //const --- Fetch items from ItemCtrl
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //function --- Fill the list with the items
                UICtrl.fillList(items);
            }
            
            //calaculate total calories
            const totalCalories = ItemCtrl.countCalories();
            // update the UI of total calories
            UICtrl.showCalories(totalCalories);

            //Call load event listener
            loadEventListener();
            
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

AppCtrl.init();

