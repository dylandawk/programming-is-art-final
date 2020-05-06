Websocket Particles
===========================

This app is built as part of a two-part final involving Websockets and Unity. It uses each client to control game objects in the unity scene.  Those game objects in turn control a particle system.  This was meant to be a collaborative interactive visual and hopefully could be used in a large scal context with multiple users.

Here are some early tests:

This first test sends messages to the WebSocket server every frame and introduced a TON of lag in Unity especially as the main thread in unity became more complex and more clients opened on the server.

[![](http://img.youtube.com/vi/_RoZzeRUlrw/0.jpg)](http://www.youtube.com/watch?v=_RoZzeRUlrw "Web Socket Test 01")

This next test only updated the server every time the touch/mouse was pressed.  This reduced the lag and led to a smoother performance for the scene at a minor cost to the user experience.

[![](http://img.youtube.com/vi/YUtA1CKXmUs/0.jpg)](http://www.youtube.com/watch?v=YUtA1CKXmUs "Web Socket Test 02")


Attribution
==============
It's been copied by @starakaj for your enjoyment, and then React has been removed You can find the original at https://glitch.com/~starter-react.

This project relates to video 2 of 5 in the [React Starter Kit](https://glitch.com/react-starter-kit) video series.
