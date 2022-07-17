//info ############################################## Constants ##############################################
const sandbox = document.querySelector("#sandbox");
const context = document.querySelector("#context");
const boxes = document.querySelector("input[name='boxes']");
//info ########################################### Event Listeners ###########################################
document.querySelector("#reset").addEventListener("click", reset);

document.querySelector(".controls").addEventListener("click", e => {
	if (e.target.classList.contains("controls")) {
		sandbox.deselectAllItems();
	}
});

boxes.addEventListener("change", function() {
	if (isNaN(this.value) || parseInt(this.value) > 20 || parseInt(this.value) < 1) {
		this.value = sandbox.prev;
	} else {
		if (parseInt(this.value) > parseInt(sandbox.prev)) {
			for (let i = sandbox.prev; i < this.value; ++i) {
				sandbox.addItem();
			}
		} else {
			for (let i = this.value; i < sandbox.prev; ++i) {
				sandbox.removeItem();
			}
		}
		sandbox.prev = parseInt(this.value);
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

document.querySelector("#select-all").addEventListener("click", () => sandbox.selectAllItems());

document.addEventListener("click", e => {
	if (e.target.nodeName !== "CHECK-BOX") {
		context.classList.add("invisible");
	}
});

document.addEventListener("contextmenu", e => {
	if (e.target.nodeName !== "FLEX-ITEM") {
		context.classList.add("invisible");
	}
});

//info ############################################## Functions ##############################################
/**
 * Reset the sandbox and the values of the sandbox controls
 */
function reset() {
	sandbox.controls.forEach(control => control.reset());
	boxes.value = Sandbox.DEFAULTS.boxes;
	sandbox.prev = parseInt(Sandbox.DEFAULTS.boxes);
	sandbox.style = "";
	sandbox.rePopulate(Sandbox.DEFAULTS.boxes);
}

//info ########################################### Run on page load ##########################################
reset();