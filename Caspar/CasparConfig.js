"use strict";

class CasparConfig {

    constructor(mediaPath, logPath, dataPath, templatePath, thumbnailsPath, channels, tcpPort, oscDefaultPort, oscPredefinedClient) {
        this.mediaPath = mediaPath;
        this.logPath = logPath;
        this.dataPath = dataPath;
        this.templatePath = templatePath;
        this.thumbnailsPath = thumbnailsPath;
        this.channels = channels;
        this.tcpPort = tcpPort;
        this.oscDefaultPort = oscDefaultPort;
        this.oscPredefinedClient = oscPredefinedClient;

    }

}

module.exports = CasparConfig;


`
<?xml version="1.0" encoding="utf-8"?>
<configuration>
`
`
  <paths>
    <media-path>${this.mediaPath}\</media-path>
    <log-path>${this.logPath}\</log-path>
    <data-path>${this.dataPath}\</data-path>
    <template-path>${this.templatePath}\</template-path>
    <thumbnails-path>${this.thumbnailsPath}\</thumbnails-path>
  </paths>
`

`
  <channels>
    <channel>
        <video-mode>PAL</video-mode>
        <consumers>
          <system-audio />
        </consumers>
    </channel>
    <channel>
        <video-mode>PAL</video-mode>
        <consumers>
          <system-audio />
        </consumers>
    </channel>
    <channel>
        <video-mode>PAL</video-mode>
        <consumers>
          <system-audio />
        </consumers>
    </channel>
    <channel>
        <video-mode>PAL</video-mode>
        <consumers>
          <system-audio />
        </consumers>
    </channel>
    <channel>
        <video-mode>PAL</video-mode>
        <consumers>
          <system-audio />
        </consumers>
    </channel>
  </channels>

`

`
  <controllers>
    <tcp>
        <port>${this.tcpPort}</port>
        <protocol>AMCP</protocol>
    </tcp>
  </controllers>
  <osc>
  <default-port>${this.oscDefaultPort}</default-port>
  <predefined-clients>
    <predefined-client>
      <address>127.0.0.1</address>
      <port>5253</port>
    </predefined-client>
  </predefined-clients>
</osc>
`
`
</configuration>
`


for (var predefinedClient in this.predefinedClient){

    `
    <predefined-client>
    <address>${predefinedClient['ipAddr']}</address>
    <port>${predefinedClient['oscPort']}</port>
    </predefined-client>
    `
}