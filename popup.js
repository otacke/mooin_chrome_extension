
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

  this.movePageUrl = undefined;

  /**
   * Get the move URL.
   *
   * @return {Promise} Results containing the move URL.
   */
  function getMovePageUrl() {
    return new Promise(function(resolve, reject) {
      return getMovePageUrl2(resolve);
    });
  }

  /**
   * Get the move URL from the DOM.
   *
   * @param {Object} callback - Callback function for the results.
   */
  function getMovePageUrl2(callback) {
    chrome.tabs.executeScript(
      {code: '(' + extractMovePageUrl + ')();'},
      callback);
  }

  /**
   * Get URL that can be used to modify the page order.
   *
   * Depends on hard coded CSS classes!
   *
   * @return {string} URL that can be used to modify the page order | undefined.
   */
  function extractMovePageUrl() {
     var arrow = document.getElementsByClassName('iconsmall up')[0];
     if (!arrow) {
       arrow = document.getElementsByClassName('iconsmall down')[0];
     }
     if (!arrow) {
       return undefined;
     }
     return arrow.parentNode.href;
  }

  /**
   * Handle the popup window.
   *
   * @param {Object} results - Results from executeScript.
   */
  function popup(results) {
    if (!results) {
      return;
    }
    that.movePageUrl = results[0];

    if (that.movePageUrl) {
      // Extract GET variables.
      that.address = that.movePageUrl.split('?')[0];
      var params = that.movePageUrl.split('?')[1].split('&');
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
        var targetMovePageUrl = that.address + '?id=' + that.id +
          '&random=' + that.random +
          '&section=' + that.section +
          '&move=' + that.move +
          '&sesskey=' + that.sesskey + '#section-' + Math.max(1, parseInt(that.section) + parseInt(that.move));

        var code = 'window.open("' + targetMovePageUrl + '", "_self")';
        chrome.tabs.executeScript({code: code});
        window.close();
      });

    }
  }

  // Let's go!
  getMovePageUrl().then(popup);

});
