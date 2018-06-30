# Welcome to our CasparCG API project ! 

The aim of this project is to offer an open-source and powerfull nodeJS API for the CasparCG server. We try to make the API easy to use to enable anyone to quickly build a personalized web interface for CasparCG.


The API uses the AMCP protocol to send commands to CasparCG.

Return states of the server are catched with the OSC protocol and send back to the clients with an socket.IO socket.

### The project is still under development. Please report the bugs you encoutered in the [issues section](https://github.com/M2I-Group-CasparCG/CasparCGAPI/issues/new).

## Quick start guide

### 1. Install and configure the CasparCG server

* Download the last CasparCG stable version [here](http://casparcg.com/download.html).
* Edit the CasparCG configuration file in order to :
  * Have a least 3 channels
  * Have a predefined OSC client matching with the server on which you run the API
  * If you need it, a demo configuration file is available [here](https://github.com/M2I-Group-CasparCG/CasparCGAPI/blob/master/utilities/API/caspar.config).

### 2. Install the API

* Make sur you have nodeJS and npm installed
    ```
    node -v
    npm -v
    ```
    If they are not, please install the last release from the [nodeJS site](https://nodejs.org/en/).

* Download the API sources
    ```bash
    git clone https://github.com/M2I-Group-CasparCG/CasparCGAPI.git
    ```
* install the depedencies
    ```bash
    npm install
    ```
* once everything is installed, just run the API 
    ```bash
    npm start 
    ```

* You should know see the current message in the nodeJS prompt :
    ```bash
    udp server listening on 0.0.0.0:5253
    Express server listening on port 3000
    ```
### Congrats ! The API is ready !

If you encountered any problem during the installation process, please [create an issue](https://github.com/M2I-Group-CasparCG/CasparCGAPI/issues/new) with the `help wanted` tag to ask for help ! 

If you want to try it with a web interface, please install our demo interface [ClydeUi](https://github.com/M2I-Group-CasparCG/ClydeUI).

## For the developpers

Please visit the [wiki](https://github.com/M2I-Group-CasparCG/CasparCGAPI/wiki).
