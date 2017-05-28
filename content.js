// Will be used to hide elements that user's don't need to change
this.active = false;

chrome.runtime.onMessage.addListener(function(request) {
  this.active = request.active;
  if (this.active) {
    hideElementsByClassName(HIDE_DOM_CLASSES);
    hideElementsById(HIDE_DOM_IDS);
    hideElementsIndividually();
  }
});

/**
 * Hide elements with a particular class name.
 *
 * @param {Object} ids - Array containing the classes' strings.
 */
function hideElementsByClassName(classes) {
  for (var i = 0; i < classes.length; i++) {
    var elements = document.getElementsByClassName(classes[i]);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  }
}

/**
 * Hide elements with a particular ID.
 *
 * @param {Object} ids - Array containing the IDs' strings.
 */
function hideElementsById(ids) {
  for (var i = 0; i < ids.length; i++) {
    // Fix illegal use of identical IDs within the DOM.
    while (true) {
      var element = document.getElementById(ids[i]);
      if (element !== null) {
        element.remove();
      }
      else {
        break;
      }
    }
  }
}

/**
 * Hide individual elements.
 *
 * In something more than a quick hack, I'd use a more general approrach for
 * describing elements that should be removed, e.g. defining an object with tag,
 * id, class and attributes for identification.
 */
function hideElementsIndividually() {
  // link to option for fntabs
  var images = document.getElementsByTagName('img');
  for (var i = 0; i < images.length; i++) {
    if (images[i].getAttribute('src') === 'https://mooin.oncampus.de/course/format/fntabs/pix/cog.png') {
      images[i].parentNode.remove();
    }
  }
}

/** @constant {Object} */
HIDE_DOM_IDS = [
  'fitem_id_config_socialmedia_link',
  'fitem_id_config_discussion_link',
  'fitem_id_config_capira_questions',
  'fitem_id_config_directory_link',
  'id_whereheader',
  'id_onthispage',
  'section-0',
  'action-menu-4',
  'fitem_id_category',
  'fitem_id_visible',
  'fitem_id_startdate',
  'fitem_id_idnumber',
  'id_courseformathdr',
  'id_appearancehdr',
  'id_filehdr',
  'id_completionhdr',
  'id_enrol_guest_header_137',
  'id_groups',
  'id_rolerenaming'
];

/** @constant {Object} */
HIDE_DOM_CLASSES = [
  'block_online_users_map',
  'summary',
  'moodle-core-dragdrop-draghandle'
];
