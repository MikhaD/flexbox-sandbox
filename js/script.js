//info ############################################## Constants ##############################################

const sandbox = document.querySelector("sand-box");
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
	sandbox.style = "";
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
	if (e.target.nodeName === "SAND-BOX") {
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
		sandbox.style[select.name] = select.value;
	}
}
sandbox.rePopulate(sandbox.prev);