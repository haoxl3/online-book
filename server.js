const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const root = __dirname + '/build';
server.use(express.static(root, {maxAge: 86400000}));
server.use(middlewares);
// 让白名单里的路由由react router接管
const reactRouterWhiteList = ['/create', '/edit/:itemId'];
server.get(reactRouterWhiteList, (request, response) => {
    response.sendFile(path.resolve(root, 'index.html'));
});
server.use(router);
server.listen(3000, () => {
    console.log('server is running');
});