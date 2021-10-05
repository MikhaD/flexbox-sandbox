//info ############################################### Classes ###############################################

class Sandbox {
	static DEFUALT_BOX_COUNT = 5;
	/** The number of boxes there were prior to the latest change in the number of boxes */
	prev = Sandbox.DEFUALT_BOX_COUNT;
	items = [];
	selectedItems = {};
	shiftStartItem = null;
	controls;

	constructor(sandbox) {
		this.sandbox = sandbox;
	}

	addItem() {
		let item = new Item(widthSelect.value, heightSelect.value);
		this.items.push(item);
		this.sandbox.appendChild(item);
	}

	removeItem() {
		let item = this.items.pop();
		delete this.selectedItems[item.n];
		item.remove();
	}

	clear() {
		Item.hue = 0;
		Item.instances = 0;
		this.sandbox.innerHTML = "";
		this.items = [];
		this.selectedItems = {};
	}
	/**
	 * Fill the sandbox with num different colored boxes
	 * @param {Number} num - The number of boxes to fill the sandbox with
	 */
	rePopulate(num) {
		this.clear();
		for (let i = 0; i < num; ++i) {
			this.addItem();
		}
	}
	/**
	 * Set the sandbox's given flex property to the value of the triggered input
	 */
	setFlexProperty(property, value) {
		this.sandbox.style[property] = value;
	}

	setItemsDimensions(dimension, value) {
		for (const item of this.items) {
			item.setDimension(dimension, value);
		}
	}

	addEventListener(event, callback) {
		this.sandbox.addEventListener(event, callback);
	}

	selectItem(item) {
		item.classList.add("selected");
		sandbox.selectedItems[item.n] = item;
	}

	deselectItem(item) {
		item.classList.remove("selected");
		delete this.selectedItems[item.n];
	}

	deselectAllItems() {
		for (const key in this.selectedItems) {
			this.deselectItem(this.selectedItems[key]);
		}
		this.shiftStartItem = null;
	}
}

class Item extends HTMLElement {
	static MAX_SIZE = 5;
	static HUE_INC = 30;
	static hue = 0;
	static instances = 0;

	constructor(width, height) {
		super();
		this.style["background-color"] = `hsl(${Item.hue}, 100%, 50%)`;
		Item.hue += Item.HUE_INC;
		this.addEventListener("click", itemClick);
		this.setDimension("width", width);
		this.setDimension("height", height);
		this.n = ++Item.instances;
	}

	setDimension(dimension, value) {
		switch (value) {
			case "unset":
				this.style[dimension] = value;
				break;
			case "random":
				this.style[dimension] = Math.ceil(Math.random()*Item.MAX_SIZE) * 5 + "vmax";
				break
			default:
				this.style[dimension] = value * 5 + "vmax";
		}
	}

	remove() {
		--Item.instances;
		Item.hue -= Item.HUE_INC;
		super.remove();
	}
}

window.customElements.define("flex-item", Item);

//info ############################################## Constants ##############################################

const sandbox = new Sandbox(document.querySelector("#sandbox"));
sandbox.controls = document.querySelectorAll("select[for='sandbox']");
const widthSelect = document.querySelector("select[name='width']");
const heightSelect = document.querySelector("select[name='height']");
const boxes = document.querySelector("input[name='boxes']");

//info ############################################## Functions ##############################################

/**
 * Reset all the inputs and the sandbox
 */
function reset() {
	widthSelect.value = widthSelect.children[0].value;
	heightSelect.value = heightSelect.children[0].value;
	sandbox.prev = Sandbox.DEFUALT_BOX_COUNT;
	boxes.value = Sandbox.DEFUALT_BOX_COUNT;
	for (const select of sandbox.controls) {
		select.value = select.children[0].value;
	}
	sandbox.sandbox.style = "";
	sandbox.prev = Sandbox.DEFUALT_BOX_COUNT;
	sandbox.rePopulate(Sandbox.DEFUALT_BOX_COUNT);
}


function itemClick(e) {
	if (e.shiftKey) {
		const temp = sandbox.shiftStartItem;
		sandbox.deselectAllItems();
		sandbox.shiftStartItem = temp;
		if (sandbox.shiftStartItem === null) {
			sandbox.shiftStartItem = sandbox.items[0];
		}
		let inc = (sandbox.shiftStartItem.n < e.currentTarget.n) ? 1 : -1;

		for (let i = sandbox.shiftStartItem.n; i - e.currentTarget.n !== 0; i += inc) {
			sandbox.selectItem(sandbox.items[i-1]);
		}
	} else if (e.ctrlKey) {
		if (e.currentTarget.classList.contains("selected")) {
			sandbox.deselectItem(e.currentTarget);
			return;
		} else {
			sandbox.shiftStartItem = e.currentTarget;
		}
	} else {
		sandbox.deselectAllItems();
		sandbox.shiftStartItem = e.currentTarget;
	}
	sandbox.selectItem(e.currentTarget);
}

//info ########################################### Event Listeners ###########################################

widthSelect.addEventListener("change", function() { sandbox.setItemsDimensions("width", this.value) })
heightSelect.addEventListener("change", function() { sandbox.setItemsDimensions("height", this.value) })

boxes.addEventListener("change", function() {
	if (this.value > 20 || this.value < 1 || isNaN(this.value)) {
		this.value = sandbox.prev;
	} else {
		if (this.value > sandbox.prev) {
			for (let i = sandbox.prev; i < this.value; ++i) {
				sandbox.addItem();
			}
		} else {
			for (let i = this.value; i < sandbox.prev; ++i) {
				sandbox.removeItem();
			}
		}
		sandbox.prev = this.value;
	}
})

for (const select of sandbox.controls) {
	select.addEventListener("change", e => {
		sandbox.setFlexProperty(e.currentTarget.name, e.currentTarget.value);
	});
}

document.querySelector("#reset").addEventListener("click", reset);

sandbox.addEventListener("click", e => {
	if (e.target.id === "sandbox") {
		sandbox.deselectAllItems();
	}
});

window.addEventListener("keydown", e => {
	if ((e.key === "a" || e.key === "A") && e.ctrlKey) {
		e.preventDefault();
		console.log(e.key, e.ctrlKey);
	}
	// if (e.key === "L") {
	// 	// Debug action here
	// }
});

//info ########################################### Run on page load ##########################################
boxes.value = Sandbox.DEFUALT_BOX_COUNT;

for (const select of sandbox.controls) {
	if (select.value !== select.children[0].value) {
		sandbox.sandbox.style[select.name] = select.value;
	}
}
sandbox.rePopulate(sandbox.prev);