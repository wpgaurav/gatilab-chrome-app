window.onresize = reLayout;
var unread = 0;

function getWebView()
{
  if (!getWebView.view)
    getWebView.view = document.querySelector('webview');

  return getWebView.view;
}

onload = function()
{
  var webview = getWebView();
  reLayout();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('message', onWebViewMessage);
  window.addEventListener('focus', function() { webview.focus(); });

  webview.style.webkitTransition = 'opacity 250ms';
  webview.addEventListener('unresponsive', function() {
    webview.style.opacity = '0.5';
  });
  webview.addEventListener('responsive', function() {
    webview.style.opacity = '1';
  });

  webview.addEventListener('loadstart', handleLoadStart);
  webview.addEventListener('loadstop', injectJS);

  webview.addEventListener('newwindow', function(e) {
    e.stopImmediatePropagation();
    window.open(e.targetUrl);
  });
};

function reLayout()
{
  var webview = getWebView();
  webview.style.width = document.documentElement.clientWidth + 'px';
  webview.style.height = document.documentElement.clientHeight + 'px';
}

function handleKeyDown(event)
{
  if (event.ctrlKey && !event.altKey)
  {
    switch (event.keyCode)
    {
      case 81: // Ctrl+q
        window.close();
        break;

      case 82: // Ctrl+r
      case 115: // F5
        getWebView().reload();
        break;
    }
  }
}

function injectJS()
{
  var webview = getWebView();
  webview.executeScript({ file: "custom.css" }, function(res) {
    webview.contentWindow.postMessage('setup', '*');
  });
}
function repaintWorkaround()
{
  /* This is an ugly workaround that unfortunately is needed in order to
   * make the webview to repaint as soon as the whatsapp web client has been
   * loaded. Without this, the view is not shown until something happens.
   *
   * So, basically we setup a mutation observer on the view that notifies
   * us when the whatsapp initialization is done, while we show/hide a dummy div
   */

  window.setTimeout(function() {
    var workaround_div = document.querySelector('#dummy-workaround');
    workaround_div.style.display = 'block';

    window.setTimeout(function() {
      workaround_div.style.display = 'none';
    }, 2000);
  }, 1000);
}
