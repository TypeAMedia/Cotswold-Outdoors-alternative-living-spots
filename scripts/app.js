class App {
	constructor() {
		this.loadDataAndInit()
	}

	async loadDataAndInit() {
		try {
			const data = await d3.csv('./data/data.csv', d3.autoType)
			this.choices = initDropdown({
				list: data.slice().sort((a, b) => {
					return d3.ascending(a.country, b.country)
				}).map((d) => {
					return {
						label: d.country,
						value: d.country,
					}
				}
				),
				id: '#countries_sel',
				placeholder: 'Select Country',
				cb: value => {
					this.selectRow(value)
				}
			})
			this.table = Table({
				headers: getHeaders(data),
				container: '#table',
				data: data,
				doneHeadersLoading: () => this.attachEventHandlers(),
			}).render()

		} catch (e) {
			console.error(e)
		}
	}
	selectRow(country) {
		if (this.table) {
			this.table.highlightRow(d => d.country === country)
		}
	}

}

new App()
