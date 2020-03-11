// ==UserScript==
// @name         [removed]
// @version      0.3
// @author       Humzaman
// @include      /https?://(www|old|np)\.reddit\.com/r/.*/comments.*/
// @require      https://cdn.jsdelivr.net/npm/snuownd
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @grant        none
// ==/UserScript==

const loaderStyle = document.createElement('style');
loaderStyle.type = 'text/css';
loaderStyle.innerHTML = ".loading-bar { background-color: #eee; background-image: linear-gradient(-45deg, rgba(149, 45, 45, .6) 25%, rgba(149, 45, 45, .0) 25%, rgba(149, 45, 45, .0) 50%, rgba(149, 45, 45, .6) 50%, rgba(149, 45, 45, .6) 75%, rgba(149, 45, 45, .0) 75%, rgba(149, 45, 45, .0)) !important; background-size: 32px 32px !important; background-repeat: repeat !important; transition: background-position 60000s linear !important; background-position: 4000000px !important; }";
document.getElementsByTagName('head')[0].appendChild(loaderStyle);

const unremoveColor = '#952d2d';

window.addEventListener('load', function() { main(); }, false);
$(document).arrive(".deleted.comment", function() { neverEndingComments(this); });

function main() {
  var deletedComments = document.querySelectorAll('.deleted.comment');

  for (let i = 0; i < deletedComments.length; i++) {
    let commentObj = deletedComments[i];
    let ul = commentObj.getElementsByClassName('flat-list buttons')[0];

    if (!ul.classList.contains('unremove_li')) {
      let a = document.createElement("a");
      a.setAttribute('class', 'unremove_a');
      a.textContent = 'unremove';
      a.setAttribute('href', 'javascript:void(0)');
      a.onclick = function(f) { return function() { fetchData(f); }; }(commentObj);
      a.style.color = unremoveColor;
  
      let li = document.createElement('li');
      li.setAttribute('class', 'unremove_li');
      li.onclick = function(r) { if (this.style.display === "none") { this.style.display = "block"; } else { this.style.display = "none"; } };
      li.appendChild(a);
      ul.appendChild(li);
      $(li).hide().fadeIn(500);
    }
  }
}

function fetchData(commentObj) {
  let prmlnksplit = commentObj.dataset.permalink.split("/");
  let pushshiftUrl = "https://api.pushshift.io/reddit/search/comment/?ids=".concat(prmlnksplit[prmlnksplit.length-2]);
  
  let tagline = commentObj.getElementsByClassName('tagline')[0];
  let usertextbody = commentObj.getElementsByClassName('usertext-body')[0];
  $(usertextbody).toggleClass('loading-bar');

  fetch(pushshiftUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let parsedData = data.data[0];
    
    if (parsedData.length === 0) {
      throw "No data found. Manually throwing error.";
    }
    else {
      $(usertextbody).toggleClass('loading-bar');
      
      let p = usertextbody.getElementsByTagName("p")[0];
      p.innerHTML = SnuOwnd.getParser().render("~~".concat(p.innerHTML).concat("~~"));

      if (parsedData.author === "[deleted]") {
        let bodytext = document.createTextNode("[removed too quickly to be archived]");
        let div = document.createElement("div");
        div.className = "md";
        div.appendChild(bodytext);
        usertextbody.appendChild(div);
        $(div).hide().fadeIn(500);
      }
      else { 
        let username = document.createElement("a");
        username.textContent = parsedData.author;
        username.setAttribute("href", "https://www.reddit.com/user/".concat(parsedData.author));
        username.style.fontWeight = "bold";
        username.style.color = unremoveColor;
        username.className = "author may-blank id-".concat(parsedData.author_fullname);
        tagline.appendChild(username);
        $(username).hide().fadeIn(500);
        let span = document.createElement("span");
        span.className = "userattrs";
        tagline.appendChild(span);
        
        let bodytext = document.createRange().createContextualFragment(SnuOwnd.getParser().render(parsedData.body));
        let div = document.createElement("div");
        div.className = "md";
        div.appendChild(bodytext);
        usertextbody.appendChild(div); 
        $(div).hide().fadeIn(500);
      }
    }
  })
  .catch((error) => {
    $(usertextbody).toggleClass('loading-bar');
    console.error(error);
    
    let p = usertextbody.getElementsByTagName("p")[0];
    p.innerHTML = SnuOwnd.getParser().render("~~".concat(p.innerHTML).concat("~~"));

    let bodytext = document.createTextNode("[no data found]");
		let div = document.createElement("div");
    div.className = "md";
    div.appendChild(bodytext);
    usertextbody.appendChild(div);
    $(div).hide().fadeIn(500);
  });
}

function neverEndingComments(commentObj) {
    let ul = commentObj.getElementsByClassName('flat-list buttons')[0];

    if (!ul.classList.contains('unremove_li')) {
      let a = document.createElement("a");
      a.setAttribute('class', 'unremove_a');
      a.textContent = 'unremove';
      a.setAttribute('href', 'javascript:void(0)');
      a.onclick = function(f) { return function() { fetchData(f); }; }(commentObj);
      a.style.color = unremoveColor;
  
      let li = document.createElement('li');
      li.setAttribute('class', 'unremove_li');
      li.onclick = function(r) { if (this.style.display === "none") { this.style.display = "block"; } else { this.style.display = "none"; } };
      li.appendChild(a);
      ul.appendChild(li);
      $(li).hide().fadeIn(500);
    }
}
