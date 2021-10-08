//info ############################################## Constants ##############################################
const sandbox = document.querySelector("#sandbox");
const context = document.querySelector("#context");
const boxes = document.querySelector("input[name='boxes']");
const inputs = document.querySelectorAll("input");
const selects = document.querySelectorAll("select");
//info ########################################### Event Listeners ###########################################
document.querySelector("#reset").addEventListener("click", reset);

document.querySelector(".controls").addEventListener("click", e => {
	if (e.target.classList.contains("controls")) {
		sandbox.deselectAllItems();
	}
});

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
});

window.addEventListener("keydown", e => {
	if ((e.key === "a" || e.key === "A") && e.ctrlKey && document.activeElement.nodeName !== "INPUT") {
		e.preventDefault();
		sandbox.selectAllItems();
	}
	// if (e.key === "L") {
	// 	// Debug action here
	// }
});

document.addEventListener("click", e => {
	if (e.target.nodeName !== "CHECK-BOX") {
		context.classList.add("hidden");
	}
});

document.addEventListener("contextmenu", e => {
	if (e.target.nodeName !== "FLEX-ITEM") {
		context.classList.add("hidden");
	}
});

//info ############################################## Functions ##############################################
/**
 * Reset all the inputs and the sandbox
 */
 function reset() {
	for (const input of inputs) {
		input.value = input.getAttribute("initial");
	}
	sandbox.prev = Sandbox.DEFUALT_BOX_COUNT;
	for (const select of selects) {
		if (select.children[0]) {
			select.value = select.children[0].value;
		}
	}
	sandbox.style = "";
	sandbox.rePopulate(Sandbox.DEFUALT_BOX_COUNT);
}

//info ########################################### Run on page load ##########################################
boxes.setAttribute("initial", Sandbox.DEFUALT_BOX_COUNT);
reset();