var request = require('request');
var jsdom = require('jsdom').jsdom;
var getImgurImages = require('./getImgurImages');
var pageUtils = require('./pageUtils');

module.exports = function getImages(url, callback) {
	request(url, function(err, response, body) {
		if (err) throw err;

		let document = jsdom(body);

		let hasPosts = pageUtils.hasPosts(document);

		if (!hasPosts) {
			return callback(`No posts found on this page.`);
		}

		let count = pageUtils.getPostCount(document);

		if (count < 30) {
			return callback(`page ${url}\n has less than 30 posts on it; ABORT`);
		}

		let images = [];

    // count is now the num of posts on the page
		for (var i = 0; i < count; i++) {
			var post = document.querySelector(`body > table:nth-of-type(${pageUtils.postBase + i + 1})`);

			var postAuthor = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(1) font b`).innerHTML;
			console.log(`Post author is ${postAuthor}`);

			var postDate = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[1].nodeValue;
			postDate = new Date(postDate);

			var postPermalink = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[4].href;

			var postId = /post\/(\d+)/g.exec(postPermalink)[1];

			var postContent = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(2) font:nth-of-type(2)`);

      var imageCount = 0;

      var allPostData = {
        author: postAuthor,
        permalink: postPermalink,
        date: postDate
      };

      [].forEach.call(postContent.childNodes, function(node) {
        var postData,
            src;

        if (node.nodeName === 'IMG') {

          src = node.src;
          postData = Object.assign({}, allPostData, {
            image: src,
            id: `${postId}_${++imageCount}`
          });

          images.push(postData);

        } else if (node.nodeName === 'A' &&
                    node.firstElementChild &&
                    node.firstElementChild.nodeName === 'IMG' &&
                    node.firstElementChild.src.includes('imgur.com')) {

          postData = Object.assign({}, allPostData, {
            postId: postId,
            startIndex: ++imageCount
          });

          getImgurImages(node.href, postData, callback);

        } else if (node.nodeName === 'A' &&
                    node.firstElementChild &&
                    node.firstElementChild.nodeName === 'IMG') {

          src = node.firstElementChild.src;
          postData = Object.assign({}, allPostData, {
            image: src,
            id: `${postId}_${++imageCount}`
          });

          images.push(postData);

        } else if (node.nodeName === 'A' &&
                    node.host.includes('imgur.com')) {
          postData = Object.assign({}, allPostData, {
            postId: postId,
            startIndex: ++imageCount
          });
          getImgurImages(node.href, postData, callback);
        }

      });
    }
    callback(null, images);
  });
};
