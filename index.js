const http = require('http');

const redirectMap = new Map([
  ['kurt@seifried.org', '@kurtseifried@mastodon.social'],
  ['test@seifried.org', '@test@tld']
]);

const requestListener = function (req, res) {
    const requestString = req.url
    const email = requestString.replace("/.well-known/webfinger?resource=acct:", "");

    const resourceData = redirectMap.get(email);
    if (resourceData) {
	const resourceArray = resourceData.split("@");
	const username = resourceArray[1];
	const hostname = resourceArray[2];
	const jsonData = "{\"subject\":\"acct:" + email + "\",\"aliases\":[\"https://" + hostname + "/@" + username + "\",\"https://" + hostname + "/users/" + username + "\"],\"links\":[{\"rel\":\"http://webfinger.net/rel/profile-page\",\"type\":\"text/html\",\"href\":\"https://" + hostname + "/@" + username + "\"},{\"rel\":\"self\",\"type\":\"application/activity+json\",\"href\":\"https://" + hostname + "/users/" + username + "\"},{\"rel\":\"http://ostatus.org/schema/1.0/subscribe\",\"template\":\"https://" + hostname + "/authorize_interaction?uri={uri}\"}]}";
	
	res.writeHead(200);
	res.end(jsonData);
    } else {
	res.writeHead(404);
	res.end("");
    }

}

const server = http.createServer(requestListener);
server.listen(8080);
