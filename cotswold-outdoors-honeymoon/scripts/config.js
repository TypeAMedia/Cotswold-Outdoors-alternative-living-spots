const colors = ["#82B47A", "#8CB976", "#ABC16C", "#C9BB60", "#D28D53", "#DA4D45"];

const smallArrow = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.351472 0.298263C0.820101 -0.099421 1.5799 -0.099421 2.04853 0.298263L6 3.65153L9.95147 0.298263C10.4201 -0.099421 11.1799 -0.099421 11.6485 0.298263C12.1172 0.695947 12.1172 1.34072 11.6485 1.7384L6.84853 5.81174C6.3799 6.20942 5.6201 6.20942 5.15147 5.81174L0.351472 1.7384C-0.117157 1.34072 -0.117157 0.695947 0.351472 0.298263Z" fill="#324C3D"/>
</svg>`;

const triangleUp = `<svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 0L10.2631 8.25L0.73686 8.25L5.5 0Z" fill="#DA4D45"/>
</svg>`;

function mainHeaderTemplate() {
  return fakePromise(`<div class="loc-header">
    <div class="triangle">${triangleUp}</div>
    <div class="label">${this.name}</div>
  </div>`);
}

function headerTemplate() {
  const name = this.name;
  const icon = this.icon;

  return loadSvg(icon).then((iconStr) => {
    return `<button class="header-btn">
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

  return `<div class="color-box" style="background-color: ${color}; color: ${textColor};">
    ${prefix}${format(d[propName])}
  </div>`;
}

function sortFunc(a, b, order) {
  let orderFunc = order == "asc" ? "ascending" : "descending";

  return d3[orderFunc](a[this.rankProp], b[this.rankProp]);
}

function getHeaders(data) {
  const columns = [
    {
      id: 1,
      isMainColumn: true,
      name: "Order by",
      propName: "Country",
      rankProp: "Country",
      description: "",
      icon: "",
      class: "",
      cellTemplate: mainCellTemplate,
      headerTemplate: mainHeaderTemplate,
    },
    {
      id: 2,
      name: "Overall rank",
      propName: "FINAL RANK",
      rankProp: "FINAL RANK",
      description: "",
      order: "asc",
      icon: "./images/icon-overall.svg",
      class: "",
      infoOrder: 6,
      cellTemplate,
      format: ordinal_suffix_of,
      sort: sortFunc,
      headerTemplate,
    },
    {
      id: 3,
      name: "Protected spaces",
      propName: "Spacing_Ranking",
      rankProp: "Spacing_Ranking",
      description: "",
      icon: "./images/icon-spaces.svg",
      class: "",
      infoOrder: 1,
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 4,
      name: "Top-rated campsites",
      propName: "Camp_Ranking",
      rankProp: "Camp_Ranking",
      description: "",
      icon: "./images/icon-camp.svg",
      infoOrder: 2,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 5,
      name: "Hiking trails",
      propName: "Hiking_Ranking",
      rankProp: "Hiking_Ranking",
      icon: "./images/icon-hiking.svg",
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
      name: "Outdoor activities",
      propName: "Outdoors_Ranking",
      rankProp: "Outdoors_Ranking",
      description: "",
      icon: "./images/icon-activities.svg",
      infoOrder: 4,
      class: "",
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 7,
      name: "Stargazing",
      propName: "Stargazing_Ranking",
      rankProp: "Stargazing_Ranking",
      description: "",
      icon: "./images/icon-stargazing.svg",
      infoOrder: 5,
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
    };

    if (!d.isMainColumn) {
      const extent = d3.extent(data, x => x[d.rankProp]);
      col.colorScale = d3.scaleQuantile(extent, colors);
    }

    return col;
  });
}
