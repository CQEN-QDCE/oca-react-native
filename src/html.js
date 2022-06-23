module.exports = function () {
  return `
<html>
  <head>
    <style>
      #app {
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div id="app" style="min-height 200px; width:100%; margin-top: 50px;background-color:black;">
      <h1 style='color: white'>Hello from webview</h1>
    </div>
  </body>
</html>
`;
};
