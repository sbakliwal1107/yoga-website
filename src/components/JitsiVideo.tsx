import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { JITSI_DOMAIN } from "@/lib/constants";

// Embeds a Jitsi Meet room inside a WebView so the user never leaves the app.
// This works on the free public meet.jit.si server. For higher reliability
// you can self-host Jitsi later — the props below stay the same.
export type JitsiEvent = "joined" | "left" | "ready-to-close"
export function JitsiVideo({
  room,
  displayName,
  isModerator = false,
  onEvent,
}: {
  room: string;
  displayName: string;
  isModerator?: boolean;
  onEvent?: (e: JitsiEvent) => void;
}) {
  const html = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
    <style>html,body,#meet{height:100%;margin:0;background:#000}</style>
    <script src='https://${JITSI_DOMAIN}/external_api.js'></script>
  </head>
  <body>
    <div id="meet"></div>
    <script>
	  function send(type, payload) {
		  if(window.ReactNativeWebView && window.ReactNativeWebView.postMessage){
			  window.ReactNativeWebView.postMessage(JSON.stringify({ type : type, payload : payload || null}));
		  }
	  }	
      const api = new JitsiMeetExternalAPI('${JITSI_DOMAIN}', {
        roomName: ${JSON.stringify(room)},
        parentNode: document.getElementById('meet'),
        userInfo: { displayName: ${JSON.stringify(displayName)} },
        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          startWithAudioMuted: ${isModerator ? "false" : "true"},
          startWithVideoMuted: ${isModerator ? "false" : "true"}
        },
        interfaceConfigOverwrite: {
          MOBILE_APP_PROMO: false,
          SHOW_JITSI_WATERMARK: false,
          TOOLBAR_BUTTONS: [
            'microphone','camera','hangup','chat','tileview','raisehand','fullscreen'
          ]
        }
      });
     api.addEventListener('videoConferenceJoined',() => send('joined'));
	 api.addEventListener('videoConferenceLeft', () => send('left'));
	 api.addEventListener('readyToclose', () => send('ready-to-close'));
    </script>
  </body>
</html>`;

  function handleMessage(e: WebViewMessageEvent) {
	  if(!onEvent) return;
	  try {
		  const data = JSON.parse(e.nativeEvent.data) as { type: JitsiEvent };
		  if (data?.type) onEvent(data.type);
	  } catch {
		  //ignore non-JSON messages
	  }
  }	

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html, baseUrl: `https://${JITSI_DOMAIN}` }}
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
		mediaCapturePermissionGrantType="grant"
		onMessage={handleMessage}
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  web: { flex: 1, backgroundColor: "#000" },
});
