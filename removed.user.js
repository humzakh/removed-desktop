// ==UserScript==
// @name         [removed]
// @version      0.1
// @author			 Humzaman
// @include      /https?://(www|old|np)\.reddit\.com.*/
// @require      https://cdn.jsdelivr.net/npm/snuownd
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ".loading-bar { background-color: #eee; background-image: linear-gradient(-45deg, rgba(255, 255, 255, .6) 25%, rgba(255, 255, 255, .0) 25%, rgba(255, 255, 255, .0) 50%, rgba(255, 255, 255, .6) 50%, rgba(255, 255, 255, .6) 75%, rgba(255, 255, 255, .0) 75%, rgba(255, 255, 255, .0)) !important; background-size: 32px 32px !important; background-repeat: repeat !important; transition: background-position 60000s linear !important; background-position: 4000000px !important; }";
document.getElementsByTagName('head')[0].appendChild(style);

window.addEventListener('load', function() { main(); }, false);

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
      a.onclick = function(f) { return function() {fetchData(f); }; }(commentObj);
      a.style.color = '#952d2d';
  
      let li = document.createElement('li');
      li.setAttribute('class', 'unremove_li');
      li.onclick = function(r) { if (this.style.display === "none") { this.style.display = "block"; } else { this.style.display = "none"; } };
      li.appendChild(a);
      ul.appendChild(li);
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
      }
      else { 
        let username = document.createElement("a");
        username.textContent = parsedData.author;
        username.setAttribute("href", "https://www.reddit.com/user/".concat(parsedData.author));
        username.style.fontWeight = "bold";
        username.style.color = '#952d2d';
        username.className = "author may-blank id-".concat(parsedData.author_fullname);
        tagline.appendChild(username);
        let span = document.createElement("span");
        span.className = "userattrs";
        tagline.appendChild(span);
        
        let bodytext = document.createRange().createContextualFragment(SnuOwnd.getParser().render(parsedData.body));
        let div = document.createElement("div");
        div.className = "md";
        div.appendChild(bodytext);
        usertextbody.appendChild(div); 
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
  });
}
