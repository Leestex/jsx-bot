# Concept

### Input

```jsx
const message = (
  <Message recipient="1905720572" notification="SILENT_PUSH">
    <Text>Hello, {user.firstName}!</Text>
    <Attachment payload={images.welcome} type="image" />
    <QuickReply payload={commands.start}>Show menu</QuickReply>
    <QuickReply payload={commands.language}>Change language</QuickReply>
    <QuickReply payload={commands.auth}>Authorize</QuickReply>
    <MetaData>{meta.welcome}</MetaData>
  </Message>
)
```

### Output

```javascript
const message = {
  recipient: {
    id: '1905720572'
  },
  message: {
    text: `Hello, ${user.firstName}!`,
    attachment: {
      type: 'image',
      payload: {
        url: images.welcome
      },
    },
    quick_replies: [
      {
        content_type: 'text',
        title: 'Show menu',
        payload: commands.start
      },
      {
        content_type: 'text',
        title: 'Change language',
        payload: commands.language
      },
      {
        content_type: 'text',
        title: 'Authorize',
        payload: commands.auth
      }
    ],
    metadata: meta.welcome
  },
  notification_type: 'SILENT_PUSH'
}
```

# Examples

### Facebook Messenger

```jsx
/** @jsx jsx-object */

import request from 'request'
import { Message } from 'jsx-bot/facebook'

const user = {
  id: '1905720572',
  firstName: 'Nazar'
}

const commands = {
  start: 'CMD_START',
  language: 'CMD_LANG',
  auth: 'CMD_AUTH'
}

const images = {
  welcome: 'http://imagehosting.com/welcome.jpg'
}

const message = (
  <Message recipient={user.id} notification="SILENT_PUSH">
    <Message.Text>Hello, {user.firstName}!</Message.Text>
    <Message.Attachment payload={images.welcome} type="image" />
    <Message.QuickReply payload={commands.start}>Show menu</Message.QuickReply>
    <Message.QuickReply payload={commands.language}>Change language</Message.QuickReply>
    <Message.QuickReply payload={commands.auth}>Authorize</Message.QuickReply>
  </Message>
)

request.post('https://graph.facebook.com/v2.6/me/messages', {
  qs: { access_token: process.env.FB_ACCESS_TOKEN },
  json: message
})
```
