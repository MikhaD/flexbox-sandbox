class CheckBox extends HTMLElement {
	static template = (()=>{
		const t = document.createElement("template");
		t.innerHTML =
		`
		<style>
			#container {
				display: flex;
				align-items: center;
				padding: 1rem;
				cursor: pointer;
			}
			#box {
				display: grid;
				place-items: center;
				width: 20px;
				height: 20px;
			}
			#check {
				margin-top: -5px;
				font-size: 20px;
			}
			.hidden {
				display: none;
			}
			slot {
				display: inline-block;
				margin-left: 1rem;
				font-size: 1.6rem;
				user-select: none;
			}
		</style>
		<div id="container" part="container">
			<div id="box" part="box">
				<div id="check" part="check">✔</div>
			</div>
			<slot part="label"></slot>
		</div>
		`;
		return t;
	})();

	/**
	 * Create a new checkbox object for a css property in a context menu, with a label in the form `property: value`
	 * @param {Item} item The item in the sandbox that the checkbox applies to
	 * @param {string} property The css property the checkbox represents
	 * @param {string} value The value of the css property
	 */
	constructor(item, property, value) {
		super();
		this.item = item;
		this.property = property;
		this.value = value;
		this.attachShadow({mode: "open"});
		this.textContent = `${this.property}: ${this.value}`;
	}
	connectedCallback() {
		this.shadowRoot.appendChild(CheckBox.template.content.cloneNode(true));

		const check = this.shadowRoot.querySelector("#check");

		if (this.getAttribute("checked") === null) {
			this.setAttribute("checked", false);
			check.style.display = "none";
		}
		this.shadowRoot.querySelector("#container").addEventListener("click", e => {
			if (this.getAttribute("checked") == "true") {
				this.setAttribute("checked", false);
				check.style.display = "none";
				// Remove the style from the relevant item
				this.item.style[this.property] = null;
			} else {
				this.setAttribute("checked", true);
				check.style.display = null;
				// Apply the style to the relevant item
				this.item.style[this.property] = this.value;
			}
		});
	}
}

window.customElements.define("check-box", CheckBox);
