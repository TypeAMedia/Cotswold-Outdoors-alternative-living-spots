const getMobileBreakdown = () => {
  const viewport = window.innerWidth;

  if (viewport <= 576) {
    return "xs";
  } else if (viewport <= 768) {
    return "sm";
  } else if (viewport <= 992) {
    return "md";
  } else if (viewport <= 1200) {
    return "lg";
  } else {
    return "rest";
  }
};
const isMobile = (mobileBreakdown) => {
  const viewport = window.innerWidth;
  let brWidth = 576;

  if (mobileBreakdown === "xs") {
    brWidth = 576;
  } else if (mobileBreakdown === "sm") {
    brWidth = 768;
  } else if (mobileBreakdown === "md") {
    brWidth = 992;
  }
  return true
};

function Table(params) {
  const attrs = Object.assign(
    {
      id: Math.floor(Math.random() * 10000000),
      container: "body",
      data: [], // all data
      headers: [], // column configs
      rankedData: [],
      rankProp: '',
      cellHeight: 54, // height of each cells in table body
      firstColumnWidth: {
        // city column width (varies based on screen size),
        xs: 165,
        sm: 205,
        md: 205,
        lg: 205,
        rest: 205,
      },
      pageSize: {
        // show
        xs: 10,
        sm: 10,
        md: 10,
        lg: 10,
        rest: 10,
      },
      numOfColumnsMobile: {
        xs: 3,
        sm: 3,
        md: 10,
        lg: 10,
        rest: 12,
      },
      pagination: true,
      mobileBreakdown: "xs",
      sortable: true,
      highlighted: null,
      onSearch: () => { },
    },
    params
  );

  var store,
    showMoreOrLessBtn,
    eachWidth,
    viewPortWidth,
    container, // container div (d3 selection)
    table, // table.choropleth div
    tableHeader, // header div
    tableRow, // table rows (d3 selection)
    tBody, // table body div
    tableHeadCells, // table header cells (d3 selection)
    transitionDuration = 750, // how long should the transition take
    headers = attrs.headers, // headers passed from main.js
    showNColumnsMobile = 2, // how many columns to show on mobile scrollable horizontally;
    currentSort = null, // current sort column
    timer,
    firstColumnWidth,
    scrollWidth,
    pageSize;


  const getValue = (d, propName) => {
    let prop = propName;
    if (typeof propName === "function") {
      prop = propName(d);
    }
    return d[prop];
  };

  function adjustScrollBar(left) {
    const tBodyWidth = tBody.node().getBoundingClientRect().width;
    const p = left / (scrollWidth - firstColumnWidth);

    container
      .selectAll(".scroll-bar")
      .style("left", firstColumnWidth + p * tBodyWidth + "px");
  }

  function main() {
    setDimensions();
    store = new DataStore(attrs.data, pageSize)
    container = d3.select(attrs.container);
    currentSort = headers.find((d) => d.order);

    table = container
      .patternify({
        tag: "div",
        selector: "table-grid",
      })
      .on("scroll", function () {
        adjustScrollBar(this.scrollLeft);
      });

    tableHeader = table.patternify({
      tag: "div",
      selector: "table-header",
    });

    table.patternify({
      tag: "div",
      selector: "table-divider",
    }).html("<div class='line'></div>");

    tBody = table
      .patternify({
        tag: "div",
        selector: "table-body",
      })
      .style("position", "relative")

    drawAll();
  }

  function adjustHeight() {
    setTimeout(() => {
      const isItMobile = isMobile(attrs.mobileBreakdown);
      const tableHeaderHeight = attrs.headerHeight;

      let tableHeight =
        tableHeaderHeight + attrs.cellHeight * store.currentData.length;

      if (store.currentData.length > 10 && !isItMobile) {
        tableHeight =
          tableHeaderHeight +
          attrs.cellHeight * Math.min(10, store.currentData.length);
        tBody
          .style("height", attrs.cellHeight * 10 + "px")
          .style("overflow-y", "auto")
          .style("scroll-behavior", "smooth");
      } else {
        tBody
          .style("height", null)
          .style("overflow-y", null)
          .style("scroll-behavior", null);
      }

      table.style("height", (tableHeight + 10) + "px");
    }, 0);
  }

  function adjustShowBtn() {
    if (store.onlyOnePage) {
      showMoreOrLessBtn.style("display", "none");
    } else {
      showMoreOrLessBtn.style("display", null);
      if (store.currentData.length >= store.filtered_data.length) {
        showMoreOrLessBtn.html(`<svg fill="#000000" height="24px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#000000" stroke-width="20.79"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>`);
      } else {
        showMoreOrLessBtn.html(`<svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.43934 0.43934C1.02513 -0.146447 1.97487 -0.146447 2.56066 0.43934L7.5 5.37868L12.4393 0.43934C13.0251 -0.146447 13.9749 -0.146447 14.5607 0.43934C15.1464 1.02513 15.1464 1.97487 14.5607 2.56066L8.56066 8.56066C7.97487 9.14645 7.02513 9.14645 6.43934 8.56066L0.43934 2.56066C-0.146447 1.97487 -0.146447 1.02513 0.43934 0.43934Z" fill="#100C08"/>
        </svg>
        `).attr("data-order", "more");
      }
    }
  }

  function addScrollBar() {
    if (isMobile(attrs.mobileBreakdown)) {
      container.patternify({
        tag: "div",
        selector: "scroll-bar",
      });
      container.patternify({
        tag: "div",
        selector: "scroll-bar-back",
      });
    } else {
      container.selectAll(".scroll-bar").remove();
      container.selectAll(".scroll-bar-back").remove();
    }
  }

  function adjustScrollBar(left) {
    const tBodyWidth = tBody.node().getBoundingClientRect().width;
    const p = left / (scrollWidth - firstColumnWidth);

    container
      .selectAll(".scroll-bar")
      .style("left", firstColumnWidth + p * tBodyWidth + "px");
  }

  function setDimensions() {
    const br = getMobileBreakdown();
    if (isMobile(attrs.mobileBreakdown)) {
      attrs.pagination = true;
    } else {
      attrs.pagination = false;
    }
    pageSize = attrs.pagination ? attrs.pageSize[br] : attrs.data.length + 1;
    showNColumnsMobile = attrs.numOfColumnsMobile[br];
    firstColumnWidth = attrs.firstColumnWidth[br];

    if (store) {
      store.pageSize = pageSize;
    }
  }

  function drawAll(resize) {
    if (attrs.pagination) {
      showMoreOrLessBtn = container
        .patternify({
          tag: "button",
          selector: "show-btn",
        })
        .attr(
          "class",
          "show-btn bg-white flex items-center justify-center  block w-full text-white p-6 mt-5 rounded-md"
        )
        .attr("data-order", "more")
        .html('TEST')
        .on("click", function () {
          if (store.currentData.length >= store.filtered_data.length) {
            collapse();
          } else {
            showMore();
          }
        });

      adjustShowBtn();
    } else {
      container.selectAll(".show-btn").remove();
    }

    d3.select(".table-head.main-column").style("height", null);

    addTableHead(resize);
    addTableBody();
    adjustHeight();

    if (attrs.sortable) {
      if (currentSort) {
        sortTableBy(currentSort, false);
      }
    }

    addScrollBar();
    makeItResponsive();
  }

  function addTableHead(resize) {
    tableHeadCells = tableHeader
      .patternify({
        tag: "div",
        selector: "table-head",
        data: headers,
      })
      .attr("class", (d, i) => {
        return (
          "table-head" +
          (d.isMainColumn ? " main-column" : "") +
          (d.class ? " " + d.class : "")
        );
      })
      .attr("data-rank", (d) => d.rankProp)
      .style("width", getWidth);

    tableHeadCells.each(function (d) {
      if (resize && d.isMainColumn) {
        return;
      }

      d.headerTemplate(d).then(html => {
        d3.select(this).html(html);

        if (d.tooltip) {
          if (this._tippy) {
            this._tippy.destroy();
          }

          tippy(this, {
            theme: "light",
            content: `<div class="table-tooltip">${d.tooltip}</div>`,
            arrow: false,
            allowHTML: true,
            maxWidth: 200,
            placement: "top",
          });
        }
      });

    });

    if (attrs.sortable) {
      // click events for the columns with has sort true
      tableHeadCells
        .filter((d) => d.sort)
        .on("click", (e, d) => {
          if (d.order == "asc") {
            d.order = "desc";
          } else {
            d.order = "asc";
          }

          sortTableBy(d);
          tBody.node().scrollTop = 0;
        });
    }
  }

  function getTopCoord(d, i) {
    return i * attrs.cellHeight + "px";
  }

  function addTableBody() {
    tableRow = tBody.patternify({
      tag: "div",
      selector: "table-row",
      data: store.currentData
    });
    if (attrs.sortable) {
      tableRow.style("left", "0px").style("top", getTopCoord);
    }

    tableRow.each(function (d, i) {
      var that = d3.select(this);

      that.attr("data-index", i);

      var tableData = that
        .patternify({
          tag: "div",
          selector: "table-data",
          data: headers,
        })
        .attr("class", (d) => {
          return (
            "table-data" +
            (d.isMainColumn ? " main-column" : " value-column") +
            (d.class ? " " + d.class : "")
          );
        })
        .style("width", getWidth)
        .style("height", attrs.cellHeight + "px");

      tableData
        .patternify({
          tag: "div",
          selector: "table-data-inner",
          data: (m) => [m],
        })
        .html((x) => {
          if (x.cellTemplate && typeof x.cellTemplate === "function") {
            return x.cellTemplate(
              {
                ...d,
                value: getValue(d, x.propName),
              },
              i,
              store.currentData
            );
          }

          return getValue(d, x.propName);
        });
    });

    adjustScrollBar(0);
  }

  function sortTableBy(d, animate = true) {
    if (!d.sort) return;
    if (animate && !isMobile(attrs.mobileBreakdown)) {
      const shuffled = shuffle(store.currentData.map((d) => d.id));

      tableRow
        .sort((a, b) => {
          return shuffled.indexOf(a.id) - shuffled.indexOf(b.id);
        })
        .style("top", getTopCoord)
        .attr("data-index", (_, i) => i);
    }

    // grey out all icons and clear order property for other headers
    tableHeadCells
      .filter((d) => d.sort)
      .each(function (x) {
        const icon = d3.select(this);

        if (x.id === d.id) {
          icon.classed("active", true);
          icon.classed(x.order === "asc" ? "desc" : "asc", false);
          icon.classed(x.order, true);
        } else {
          x.order = null;
          icon.classed("active", false);
          icon.classed("desc", false);
          icon.classed("asc", false);
        }
      });

    // sorting table rows
    tableRow
      .sort((a, b) => d.sort(a, b, d.order))
      .attr("data-index", (_, i) => i)
      .transition()
      .duration(animate ? transitionDuration : 0)
      .ease(d3.easeSin)
      .style("top", getTopCoord);

    currentSort = d;
  }

  function getWidth(d) {
    if (d.isMainColumn) {
      return firstColumnWidth + "px";
    }
    return `calc((100% - ${firstColumnWidth}px) / ${headers.length - 1})`;
  }

  function makeItResponsive() {
    viewPortWidth = container.node().getBoundingClientRect().width;
    eachWidth = (viewPortWidth - firstColumnWidth) / showNColumnsMobile;

    var w =
      Math.max(
        viewPortWidth,
        eachWidth * (headers.length - 1) + firstColumnWidth
      ) + 10;

    scrollWidth = w;

    if (isMobile(attrs.mobileBreakdown)) {
      tBody.style("position", "static");
      table.classed("responsive", true);

      tableRow
        .style("width", '550px')
        .style("position", "static");

      tableHeader.style("width", '550px')

      table
        .selectAll(".main-column")
        .style("position", "absolute")
        .style("margin-left", -firstColumnWidth + "px")

      table.style("margin-left", firstColumnWidth + "px");

      table
        .selectAll(".value-column")
        .style("width", `calc(100% / ${headers.length - 1})`);

      table.selectAll(".table-head").style("width", (d, i) => {
        if (d.isMainColumn) return firstColumnWidth + "px";
        return `calc(100% / ${headers.length - 1})`;
      });

      // SCROLL BAR
      const totalWidth = w - firstColumnWidth;
      const tBodyWidth = tBody.node().getBoundingClientRect().width;
      const scrollBarWidth = tBodyWidth / totalWidth;

      container
        .selectAll(".scroll-bar")
        .style("width", tBodyWidth * scrollBarWidth + "px");

      container
        .selectAll(".scroll-bar-back")
        .style("width", eachWidth * showNColumnsMobile + "px");
    } else {
      table.classed("responsive", false);
      table
        .selectAll(".main-column")
        .style("position", null)
        .style("margin-left", null);

      table.selectAll(".table-head").style("width", getWidth);

      table
        .selectAll(".table-data")
        .style("width", getWidth)
        .style("height", attrs.cellHeight + "px");

      tBody.style("position", "relative");
      table.style("margin-left", null);

      tableRow
        .style("width", null)
        .style("margin-left", null)
        .style("position", null);

      tableHeader.style("width", null).style("margin-left", null);
    }
  }



  function updateRows() {
    addTableBody();
    adjustHeight();
    makeItResponsive();
  }

  function showMore() {
    store.nextPage();
    adjustShowBtn();
    updateRows();

    if (currentSort && attrs.sortable) {
      sortTableBy(currentSort, false);
    }
  }

  function collapse() {
    store.collapse();
    adjustShowBtn();
    updateRows();

    if (currentSort && attrs.sortable) {
      sortTableBy(currentSort, false);
    }
  }

  function highlightRow(predicate) {
    tableRow.classed("highlighted", predicate);

    setTimeout(() => {
      const rowBeingHighlighted = tableRow.filter(predicate);

      if (isMobile(attrs.mobileBreakdown)) {

        if (rowBeingHighlighted.empty() && store.currentData.length < store.all_data.length) {
          // recursively showMore and search for city
          showMore();
          highlightRow(predicate);
        } else {
          const el = rowBeingHighlighted.node();
          el.scrollIntoView()
        }
      } else {
        if (!rowBeingHighlighted.empty()) {
          const index = +rowBeingHighlighted.attr("data-index");
          const coord = getTopCoord(null, index);
          tBody.node().scrollTop = +coord.replace("px", "");
        }
      }
    }, 0);
  }

  main.filter = function (fn) {
    store.filter(fn);
    updateRows();
    return main;
  };

  main.render = function () {
    main();
    // window resize
    d3.select(window).on("resize." + attrs.id, function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setDimensions();
        drawAll(true);
      }, 100);
    });
    return main;
  };

  main.highlightRow = highlightRow;

  return main;
}
