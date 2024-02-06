class App {
	constructor() {
		this.loadDataAndInit()
	}

	async loadDataAndInit() {
		try {
			const data = await d3.csv('./data/data.csv', d3.autoType)
			this.choices = initDropdown({
				list: data
					.slice()
					.sort((a, b) => {
						return d3.ascending(a.Island, b.Island)
					})
					.map(d => ({
						label: `<div class="flex items-center">
						<img src="./images/flags/l/${d['Country Code']}.svg" class="mr-3 w-[20px] h-[15px]" /> 
						${d.Island}
					</div>`,
						value: d.Island,
					})),
				id: '#islands_sel',
				searchEnabled: true,
				placeholder: 'Find locations',
				searchPlaceholderValue: 'Search locations',
				cb: island => this.highlightRow(island),
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

	attachEventHandlers() {
		d3.select('#show_values').on('change', e => {
			const checked = e.target.checked
			this.table.toggleValues(checked)
		})
	}

	highlightRow(island) {
		this.table.highlightRow(d => d.Island === island)
	}
}

new App()
