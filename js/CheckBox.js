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

	constructor() {
		super();
		this.attachShadow({mode: "open"});
	}
	connectedCallback() {
		this.shadowRoot.appendChild(CheckBox.template.content.cloneNode(true));

		const check = this.shadowRoot.querySelector("#check");

		if (this.getAttribute("checked") === null) {
			this.setAttribute("checked", false);
			check.classList.add("hidden");
		}
		this.shadowRoot.querySelector("#container").addEventListener("click", e => {
			if (this.getAttribute("checked") == "true") {
				this.setAttribute("checked", false);
				check.classList.add("hidden");
			} else {
				this.setAttribute("checked", true);
				check.classList.remove("hidden");
			}
		});
	}
}

window.customElements.define("check-box", CheckBox);
