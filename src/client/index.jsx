const React = require('react')

class Home extends React.Component {
  render() {
    return ( <div id="root"></div> )
  }
}

let oldHTLM = (`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <title>ssMain</title>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    
    <script type="text/javascript" src="./public/bundle.js"></script>
  </body>
</html>`
)