
document.addEventListener('DOMContentLoaded', function () {
  var that = this;

  this.movePageRangeText = document.getElementById('mooinPLUS-movePage-rangeText');

  this.movePageNumber = document.getElementById('mooinPLUS-movePage-number');
  this.movePageNumber.disabled = true;

  this.movePageButton = document.getElementById('mooinPLUS-movePage-button');
  this.movePageButton.disabled = true;

  this.address = '';
  this.id = 0;
  this.random = 0;
  this.move = 0;
  this.section = '';
  this.sesskey = '';

  this.url = undefined;

  // TODO: The icon should be updated whenever the tab is changed.
  chrome.browserAction.setIcon({path: 'icons/inactive128.png'});

  function getURL() {
    return new Promise(function(resolve, reject) {
      return getURL2(resolve);
    });
  }

  /**
   * Get URL that can be used to modify the page order.
   *
   * Depends on hard coded CSS classes!
   *
   * @return {string} URL that can be used to modify the page order | undefined.
   */
  function extractURL() {
     var arrow = document.getElementsByClassName('iconsmall up')[0];
     if (!arrow) {
       arrow = document.getElementsByClassName('iconsmall down')[0];
     }
     if (!arrow) {
       return undefined;
     }
     return arrow.parentNode.href;
  }

  function getURL2(callback) {
    chrome.tabs.executeScript(
      {code: '(' + extractURL + ')();'},
      callback);
  }

  function popup(results) {
    if (!results) {
      return;
    }
    that.url = results[0];

    if (that.url) {

      // TODO: The icon should be updated whenever the tab is changed.
      chrome.browserAction.setIcon({path: 'icons/active128.png'});

      // Extract GET variables.
      that.address = that.url.split('?')[0];
      var params = that.url.split('?')[1].split('&');
      that.id = parseInt(params[0].split('=')[1]);
      that.random = parseInt(params[1].split('=')[1]);
      that.section = parseInt(params[2].split('=')[1]);
      that.sesskey = params[4].split('=')[1].split('#')[0];

      // Update popup DOM.
      that.movePageNumber.min = -(that.section-1);
      that.movePageNumber.disabled = false;
      that.movePageButton.disabled = false;
      that.movePageRangeText.innerHTML = 'Seite ' + that.section  + ' auf Seite ' + (that.section + that.move);

      // Event Listener for the move number input.
      that.movePageNumber.addEventListener('input', function() {
        that.move = parseInt(that.movePageNumber.value);
        that.movePageRangeText.innerHTML = 'Seite ' + that.section  + ' auf Seite ' + (that.section + that.move);
      });

      // Event Listener for the move button.
      that.movePageButton.addEventListener('click', function() {
        // Move page and close popup window.
        var targetURL = that.address + '?id=' + that.id +
          '&random=' + that.random +
          '&section=' + that.section +
          '&move=' + that.move +
          '&sesskey=' + that.sesskey + '#section-' + Math.max(1, parseInt(that.section) + parseInt(that.move));

        var code = 'window.open("' + targetURL + '", "_self")';
        chrome.tabs.executeScript({code: code});
        window.close();
      });

    }
  }

  // Let's go!
  getURL().then(popup);

});
