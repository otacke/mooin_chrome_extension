// Will be used to hide elements that user's don't need to change
this.active = false;

chrome.runtime.onMessage.addListener(function(request) {
  this.active = request.active;
});
