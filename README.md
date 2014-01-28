asyncTests
==========

Just a suite of tests for learning about asynchronous operations in JavaScript

To play, just clone, `npm install` and then `mocha`. If that doesn't work, it may help to install mocha globally `npm install -g mocha` (may need `sudo`) or you can just access it at `./node_modules/mocha/bin/mocha`.

You will notice some tests are failing (on `master` anyway). It's your job to make them pass. Hopefully the messages are informative, the steps are also outlined below. Initially, the later tests are disabled (`pending`), so you only see 3 errors instead of 15. Once you have the first suite passing, open the second one (`2-multiple_req.js`) and enable it by removing `.skip`.

## Goals:
1. Call the AJAX function with the URL
1. Log the result's `data` property
1. use callback instead of loop
1. make second fetch after first fetch (`res.url1`), log both
1. if an error occurs in either, log it and stop
1. as well as logging, invoke an optional callback with the final result. An early error counts as final
1. after the first fetch, fetch **both** `res.url1` **and** `res.url2` at the same time. log their `data`s concatenated
1. keep handling those errors...
1. only call the callback once
1. promises.
1. party!

## Hints
If you get stuck, there is a `solutions` branch of this repo with (roughly) 1 commit fixing each test, in order. This may be helpful, but I do recommend making a decent effort to solve the problem on your own first. If you find you are stuck and confused, you could open an issue and I will attempt to improve the errors reported by the tests. In most cases, the error messages should help you understand what needs to be done.

If you find earlier tests are failing and you think they shouldn't, try disabling (add `.skip` after `describe` or `it` to disable a suite or single test) all the tests but the one you're interested in. I encountered some issues like this in the solution branch, I need to examine `mocha` a bit more to understand why results are being mixed up.

For the even more ambitious, there is a `promise-solutions` branch, where the problems are solved using promises from the start. The ajax function does in fact return a promise, hurrah! Unfortunately the first suite of tests does not actually pass with promises, so those should be disabled from the start.
