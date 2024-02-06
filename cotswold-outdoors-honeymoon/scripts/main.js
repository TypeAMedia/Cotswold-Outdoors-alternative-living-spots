class App {
	constructor() {


		d3.csv('./data/data.csv', d3.autoType).then(resp => {
			this.data = resp

			this.dropdown = initDropdown({
				placeholder: "Select country",
				list: resp.map(d => ({ label: d.Country, value: d.Country })),
				id: '#country_sel',
				searchEnabled: true,
				cb: value => this.selectRow(value),
			})

			const headers = getHeaders(this.data)

			this.table = Table({
				container: '#table',
				data: this.data,
				headers: headers,
			}).render()
		})

	}

	selectRow(country) {
		if (this.table) {
			this.table.highlightRow(d => d.Country === country)
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App()
	window.app = app
})
