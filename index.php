<html>
<head>
  <meta http-equiv="cache-control" content="max-age=0" />
  <meta http-equiv="cache-control" content="no-store" />
  <meta http-equiv="expires" content="-1" />
  <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
  <meta http-equiv="pragma" content="no-cache" />

  <!-- css -->
  <?php

  // convert the less to css
  if (strtolower($_SERVER["HTTP_HOST"]) == "local.host" || strtolower($_SERVER["HTTP_HOST"]) == "127.0.0.1") {
      exec("lessc css/beach.styles.less css/beach.styles.css");
  }

  ?>


  <link rel="stylesheet" href="css/beach.styles.css"/>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
  <script type="text/javascript" src="js/beach.core.js"></script>
  <script type="text/javascript" src="js/beach.elements.js"></script>
  <script type="text/javascript" src="models/model.js"></script>
  <style type="text/css">
  x-nest-fancy-button {
    border-radius:8px;
    float:left;
    padding:15px;
    box-sizing:border-box;
    -webkit-box-shadow: 0px 2px 2px 0px #C7CBD3;
    -moz-box-shadow: 0px 2px 2px 0px #C7CBD3;
    box-shadow: 0px 2px 2px 0px #C7CBD3;
    background-image:linear-gradient(white, #eff0f2);
    cursor:pointer;
    margin:15px;
    margin-left:0px;
  }

  x-nest-fancy-button-icon {
    color : #00cafc;
    position:relative;
    top:2px;
  }


  @keyframes spin {
      from {
          transform:rotate(0deg);
      }
      to {
          transform:rotate(360deg);
      }
  }

  .rotate {
    animation-name: spin;
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  </style>

</head>
<body>
  <!-- <div id="nest-container" data-nest="home">

  </div> -->

  <div id="nest-remote" >

  </div>
</body>
<script type="text/javascript">

fetch('https://wax.api.atomicassets.io/atomicmarket/v1/assets/1099560596079')
  .then(response => response.json())
  .then(function(data) {

    if (data.success == true) {
        parent_element = data.data.immutable_data

        console.log(parent_element)

        if (typeof data.data.immutable_data.nest !== 'undefined') {
          nextNest = data.data.immutable_data.nest
          fetch('https://wax.api.atomicassets.io/atomicmarket/v1/assets/' + nextNest)
            .then(response => response.json())
            .then(function(data) {
                parent_element.nest = [data.data.immutable_data]
                model.remote  = [parent_element]
                    document.getElementById('nest-remote').nest(model.remote);
            })
        }
    }
  }
);


//you can also activate programmatically
// document.addEventListener("DOMContentLoaded", function(event) {
//     document.getElementById('nest-container').nest(model.home);
// });
</script>
</html>
