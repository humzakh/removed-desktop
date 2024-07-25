// ==UserScript==
// @name         [removed]
// @author       Humzaman
// @version      0.3.9
// @description  View [removed] and [deleted] comments on reddit.
// @icon         https://user-images.githubusercontent.com/13255511/74567142-b74a0380-4f3a-11ea-990b-c7d30f3fa078.png
// @downloadURL  https://raw.githubusercontent.com/Humzaman/removed-desktop/master/removed.user.js
// @homepageURL  https://github.com/Humzaman/removed-desktop
// @include      /https?://(www|old|np)\.reddit\.com/r/.*/comments.*/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require      https://cdn.jsdelivr.net/npm/snuownd
// @grant        none
// @run-at       document-start
// ==/UserScript==

const unremoveColor = '#952d2d';
const loaderStyle = document.createElement('style');
loaderStyle.type = 'text/css';
loaderStyle.innerHTML = '.loading-bar { background-color: #eee; \
                                        background-image: linear-gradient( -45deg, \
                                                                           rgba(149, 45, 45, .6) 25%, \
                                                                           rgba(149, 45, 45, .0) 25%, \
                                                                           rgba(149, 45, 45, .0) 50%, \
                                                                           rgba(149, 45, 45, .6) 50%, \
                                                                           rgba(149, 45, 45, .6) 75%, \
                                                                           rgba(149, 45, 45, .0) 75%, \
                                                                           rgba(149, 45, 45, .0) ) !important; \
                                        background-size: 32px 32px !important; \
                                        background-repeat: repeat !important; \
                                        transition: background-position 60000s linear !important; \
                                        background-position: 4000000px !important; }';
document.getElementsByTagName('head')[0].appendChild(loaderStyle);

// listen for new comments (RES neverEndingComments)
$(document).arrive('.deleted.comment', function() { addMagicLink(this); } );

var deletedComments = document.querySelectorAll('.deleted.comment');
for (let i = 0; i < deletedComments.length; i++) { addMagicLink(deletedComments[i]); }

// add unremove link to deleted comments
function addMagicLink(commentObj) {
  let ul = commentObj.getElementsByClassName('flat-list buttons')[0];

  if (!ul.classList.contains('unremove_li')) {
    let a = document.createElement('a');
    a.setAttribute('class', 'unremove_a');
    a.textContent = 'unremove';
    a.setAttribute('href', 'javascript:void(0)');
    a.style.color = unremoveColor;

    let li = document.createElement('li');
    li.setAttribute('class', 'unremove_li');
    li.onclick = function(f) { return function() { this.style.display = 'none'; fetchData(f); }; }(commentObj);
    li.appendChild(a);
    ul.prepend(li);
    $(li).hide().fadeIn(500);
  }
}

// fetch archived data from Pushshift, parse, and display
function fetchData(commentObj) {
  let tagline = commentObj.getElementsByClassName('tagline')[0];
  let usertextbody = commentObj.getElementsByClassName('usertext-body')[0];
  $(usertextbody).toggleClass('loading-bar');

  const splitPermalink = commentObj.dataset.permalink.split('/');
  //Array(8) [ "", "r", "{subreddit}", "comments", "{link_id}", "{link_title}", "{comment_id}", "" ]
  const subreddit = splitPermalink[2];
  const link_id = splitPermalink[4];
  const comment_id = splitPermalink[6];
  const pushshiftUrl = 'https://api.pullpush.io/reddit/comment/search/?ids='+comment_id;
  fetch(pushshiftUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let returnedJson = data.data;
    var parsedData = returnedJson[0];

    if (parsedData.length === 0) {
      throw 'No data found. Manually throwing error.';
    }
    else {
      $(usertextbody).toggleClass('loading-bar');

      let p = usertextbody.getElementsByTagName('p')[0];
      p.innerHTML = SnuOwnd.getParser().render('~~'.concat(p.innerHTML).concat('~~'));

      if (parsedData.author === '[deleted]') {
        let bodytext = document.createTextNode('[removed too quickly to be archived]');
        let div = document.createElement('div');
        div.className = 'md';
        div.appendChild(bodytext);
        usertextbody.appendChild(div);
        $(div).hide().fadeIn(500);
      }
      else {
      	let em = tagline.querySelector('em'); // username text that says [deleted]
      	let span = document.createElement('span');
        span.className = 'userattrs';
        tagline.insertBefore(span, em.nextSibling);

        let username = document.createElement('a');
        username.textContent = parsedData.author;
        username.setAttribute('href', 'https://www.reddit.com/user/'.concat(parsedData.author));
        username.style.fontWeight = 'bold';
        username.style.color = unremoveColor;
        username.className = 'author may-blank id-'.concat(parsedData.author_fullname);
        tagline.replaceChild(username, em);
        $(username).hide().fadeIn(500);

        let bodytext = document.createRange().createContextualFragment(SnuOwnd.getParser().render(parsedData.body));
        let div = document.createElement('div');
        div.className = 'md';
        div.appendChild(bodytext);
        usertextbody.appendChild(div);
        $(div).hide().fadeIn(500);
      }
    }
  })
  .catch((error) => { $(usertextbody).toggleClass('loading-bar');
                      console.error(error);

                      //let p = usertextbody.getElementsByTagName('p')[0];
                      //p.innerHTML = SnuOwnd.getParser().render('~~'.concat(p.innerHTML).concat('~~'));

                      let bodytext = document.createTextNode('[no archived data found]');
                      let div = document.createElement('div');
                      div.className = 'md';
                      div.appendChild(bodytext);
                      usertextbody.appendChild(div);
                      $(div).hide().fadeIn(500);
                      addMagicLink(commentObj);});
}
