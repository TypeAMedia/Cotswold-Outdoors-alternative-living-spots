  <section>
    <iframe src="https://typeamedia.github.io/cotswold-outdoors-honeymoon/" height="1332" id="iframe_id" style="border:0px #ffffff none;" name="myiFrame" scrolling="yes" frameborder="1" marginheight="0px" marginwidth="0px" width="100%" allowfullscreen></iframe>
    <script>
      function resizeIt() {
        var el = document.querySelector("#iframe_id");
        var width = el.getBoundingClientRect().width;

        var height = 1332;

        if (width < 576) {
          height = 1500;
        }

        el.setAttribute("height", height + "px");
      }
      setTimeout(resizeIt, 300); 
      window.addEventListener("resize", resizeIt);
    </script>
  </section>