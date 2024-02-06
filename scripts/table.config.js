function getFlag(country, className = 'small-flag') {
  return `<div class="flex align-center">
    <img class="${className}" src="./images/flags/l/${this.countryCodes.get(
    country
  )}.svg" /> ${country}
  </div>`
}

const smallArrow = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.351472 0.298263C0.820101 -0.099421 1.5799 -0.099421 2.04853 0.298263L6 3.65153L9.95147 0.298263C10.4201 -0.099421 11.1799 -0.099421 11.6485 0.298263C12.1172 0.695947 12.1172 1.34072 11.6485 1.7384L6.84853 5.81174C6.3799 6.20942 5.6201 6.20942 5.15147 5.81174L0.351472 1.7384C-0.117157 1.34072 -0.117157 0.695947 0.351472 0.298263Z" fill="#324C3D"/>
</svg>`;

const triangleUp = `<svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 0L10.2631 8.25L0.73686 8.25L5.5 0Z" fill="#DA4D45"/>
</svg>`;

function mainHeaderTemplate() {
  return fakePromise(`
  <div class="loc-header">
  <div class="label text-[20px] font-bold flex items-center mt-8 ml-2">${this.name}</div>
</div>`)
}

function headerTemplate() {
  const name = this.name
  const icon = this.icon

  return loadSvg(icon).then((iconStr) => {
    return `<button class="header-btn sticky">
      <div class="triangle">${triangleUp}</div>
      <div class="icon">${iconStr}</div>
      <div class="label">${name}</div>
    </button>`;
  });
}


function mainCellTemplate(d) {
  const propName = this.propName;
  return `<div class="location-box">
    ${d[propName]}
  </div>`;
}
function cellTemplate(d, i, arr) {
  const propName = this.propName;
  const format = this.format || ((m) => m);

  const scale = this.colorScale;
  const rank = d[this.rankProp];
  const color = scale(rank);
  const textColor = "#ffffff";
  const rankCount = arr.filter(x => x[this.rankProp] === rank).length;
  const prefix = (propName === "Overall" && rankCount > 1) ? "=" : "";

  return `<div class="color-box " style="background-color: ${color}; color: ${textColor};">
    ${prefix}${format(d[propName])}
  </div>`;
}

function sortFunc(a, b, order) {
  let orderFunc = order == 'asc' ? 'ascending' : 'descending'
  return d3[orderFunc](a[this.rankProp], b[this.rankProp])
}

const colors = [
  '#E7AA00',
  'rgba(231, 170, 0, 0.5)',
  'rgba(218, 77, 69, 0.5)',
  '#DA4D45',
]

function getHeaders(data) {
  const columns = [
    {
      id: 1,
      isMainColumn: true,
      isFixed: true,
      name: "Order by",
      propName: "country",
      rankProp: "country",
      description: "",
      icon: "",
      class: "",
      cellTemplate: mainCellTemplate,
      headerTemplate: mainHeaderTemplate,
    },
    {
      id: 2,
      name: "Overall rank",
      propName: "overall rank",
      rankProp: "overall rank",
      description: "",
      icon: "./images/icons/overall.svg",
      class: "",
      order: 'asc',
      infoOrder: 6,
      cellTemplate,
      format: ordinal_suffix_of,
      sort: sortFunc,
      headerTemplate,
    },
    {
      id: 3,
      name: "Countryside population",
      propName: "countryside population rank",
      rankProp: "countryside population rank",
      description: "",
      icon: "./images/icons/countrySide.svg",
      class: "",
      infoOrder: 1,
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 4,
      name: "Hiking trails",
      propName: "hiking rank",
      rankProp: "hiking rank",
      description: "",
      icon: "./images/icons/hiking.svg",
      infoOrder: 2,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 5,
      name: "Protected sites",
      propName: "protected sites rank",
      rankProp: "protected sites rank",
      icon: "./images/icons/protected.svg",
      description: "",
      infoOrder: 3,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },

    {
      id: 6,
      name: "Forested coverage",
      propName: "forested coverage rank",
      rankProp: "forested coverage rank",
      description: "",
      icon: "./images/icons/forested.svg",
      infoOrder: 5,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 7,
      name: "Veggie restaurants",
      propName: "veggie restaurants rank",
      rankProp: "veggie restaurants rank",
      description: "",
      icon: "./images/icons/veggie.svg",
      infoOrder: 4,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 8,
      name: "Vegan restaurants",
      propName: "vegan restaurants rank",
      rankProp: "vegan restaurants rank",
      description: "",
      icon: "./images/icons/vegan.svg",
      infoOrder: 4,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 9,
      name: "Outdoor festivals",
      propName: "outdoor festivals rank",
      rankProp: "outdoor festivals rank",
      description: "",
      icon: "./images/icons/outdoor.svg",
      infoOrder: 4,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },

  ];

  return columns.map((d, i) => {
    const col = {
      ...d,
      id: i + 1,
    }

    if (!d.isMainColumn) {
      const extent = d3.extent(data, x => x[d.rankProp])
      col.colorScale = d3.scaleQuantile(extent, colors)

      data.forEach(datum => {
        datum[d.rankProp + '_is_equal'] = data.filter(x => x[d.rankProp] === datum[d.rankProp]).length > 1
      })
    }

    return col
  })
}